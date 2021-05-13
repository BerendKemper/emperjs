"use strict";
const _httpMethods = require("./httpMethods");
class Route {
	#absolute = {};
	#relative = [];
	#endpoint = {};
	#distance;
	#fullpath;
	#sign;
	constructor(distance, fullpath = "", sign = "") {
		this.#fullpath = fullpath + sign;
		this.#distance = distance;
		this.#sign = sign;
	};
	add(destination) {
		let sign = destination[this.#distance];
		if (_httpMethods[sign]) throw new Error("Using CRUD operations in the path is forbidden");
		if (this.#distance === destination.length) return this.#endpoint;
		if (sign[0] === ":") {
			sign = sign.substr(1);
			for (const route of this.#relative)
				if (route.sign === sign) return route.add(destination);
			const route = new Route(this.#distance + 1, this.#fullpath + "/:", sign);
			this.#relative.push(route);
			return route.add(destination);
		}
		if (!this.#absolute[sign])
			this.#absolute[sign] = new Route(this.#distance + 1, this.#fullpath + "/", sign);
		return this.#absolute[sign].add(destination);
	};
	proceed(request, targets, failData) {
		const sign = targets[this.#distance];
		if (this.#absolute[sign]) return this.#absolute[sign].proceed(request, targets, failData);
		if (this.#distance < targets.length) {
			for (const route of this.#relative) {
				const maybeTargetAPI = route.proceed(request, targets, failData);
				if (failData.found) {
					request.params[route.sign] = sign;
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
	get sign() {
		return this.#sign;
	};
};
const noFaultyRoute = { distance: -1 };
class Routes {
	#route = new Route(0);
	add(path) {
		if (typeof path !== "string") throw new TypeError("path must be a String");
		if (path[0] !== "/") throw new TypeError('path must start with "/"');
		const destination = path.split("/").slice(1);
		return this.#route.add(destination);
	};
	walk(request) {
		request.params = {};
		const targets = request.urlPathname.split("/").slice(1);
		const failData = { fault: null, faultyRoute: noFaultyRoute, found: false };
		const api = this.#route.proceed(request, targets, failData);
		if (api) {
			request.socket._httpMessage.apiRecord = api.apiRecord;
			api(request, request.socket._httpMessage);
		}
		else if (failData.faultyRoute.distance < targets.length)
			request.socket._httpMessage.sendError(400, new Error(`Could not identify "/${failData.fault}" in "${request.urlPathname}"`));
		else
			request.socket._httpMessage.sendError(405, new Error(`Method ${request.method} not allowed in the endpoint "${failData.faultyRoute.fullpath}"`));
	};
};
module.exports = Routes;