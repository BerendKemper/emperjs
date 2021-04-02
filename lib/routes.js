"use strict";
const http = require("http");
const _package = require("../package.json");
const httpMethods = {};
for (const method of http.METHODS)
	httpMethods[method] = true;
class Route {
	#absolute = {};
	#relative = {};
	#endpoint = {};
	#distance;
	#fullpath;
	constructor(distance, fullpath = "", sign = "") {
		this.#distance = distance;
		this.#fullpath = fullpath + sign;
	};
	add(destination) {
		let sign = destination[this.#distance];
		if (this.#distance === destination.length)
			return this.#endpoint;
		if (sign[0] === ":") {
			sign = sign.substr(1);
			if (!this.#relative[sign])
				this.#relative[sign] = new Route(this.#distance + 1, this.#fullpath, "/:" + sign);
			return this.#relative[sign].add(destination);
		}
		if (!this.#absolute[sign])
			this.#absolute[sign] = new Route(this.#distance + 1, this.#fullpath, "/" + sign);
		return this.#absolute[sign].add(destination);
	};
	proceed(request, targets, failData) {
		const sign = targets[this.#distance];
		if (this.#absolute[sign])
			return this.#absolute[sign].proceed(request, targets, failData);
		if (this.#distance < targets.length) {
			for (const param in this.#relative) {
				const maybeTargetAPI = this.#relative[param].proceed(request, targets, failData);
				if (failData.found) {
					request.params[param] = sign;
					return maybeTargetAPI;
				}
			}
			if (this.#distance > failData.faultyRoute.distance) {
				failData.faultyRoute = this;
				failData.fault = sign;
			}
		}
		else if (typeof this.#endpoint[request.method] === "function") {
			failData.found = true;
			return this.#endpoint[request.method];
		}
		else if (this.#distance > failData.faultyRoute.distance) {
			failData.faultyRoute = this;
			failData.fault = sign;
		}
	};
	get distance() {
		return this.#distance;
	};
	get fullpath() {
		return this.#fullpath;
	};
};
const noFaultyRoute = { distance: -1 };
class Routes {
	#route = new Route(0);
	add(path) {
		if (typeof path !== "string")
			throw new TypeError("path must be a String");
		if (path[0] !== "/")
			throw new TypeError('path must start with "/"');
		const destination = path.split("/").slice(1);
		return this.#route.add(destination);
	};
	walk(request) {
		request.params = {};
		const targets = request.urlPathname.split("/").slice(1);
		const failData = { fault: null, faultyRoute: noFaultyRoute, found: false };
		const api = this.#route.proceed(request, targets, failData);
		if (api) {
			request.socket._httpMessage.report = api.record;
			return api(request, request.socket._httpMessage);
		}
		else if (failData.faultyRoute.distance < targets.length)
			request.socket._httpMessage.sendError(400, new Error(`Could not identify "/${failData.fault}" in "${request.urlPathname}"`));
		else
			request.socket._httpMessage.sendError(405, new Error(`Method ${request.method} not allowed in the endpoint "${failData.faultyRoute.fullpath}"`));
	};
};
module.exports = Routes;