"use strict";
const http = require("http");
const depth = Symbol("depth");
const config = require("../config.json");
const httpMethods = {};
for (const method of http.METHODS)
	httpMethods[method] = true;
const isEndpoint = Symbol("Is an endpoint");
const noFaultyRoute = { [depth]: -1 };
const pathSplitter = path => {
	const [, ...combo] = path.split("/");
	return combo;
};
function PathFinder(request) {
	request.params = {};
	this.request = request;
	this.found = false;
	this.faultyRoute = noFaultyRoute;
	this.fault = -1;
};
PathFinder.prototype.pursue = function pursue(route, targets) {
	let sign;
	[sign, ...targets] = targets;
	if (route[sign])
		return this.pursue(route[sign], targets);
	else {
		if (sign !== undefined) {
			for (const param in route)
				if (param[0] === "/") {
					const maybeTargetAPI = this.pursue(route[param], targets);
					if (this.found) {
						this.request.params[param.substr(1)] = sign;
						return maybeTargetAPI;
					}
				}
			if (route[depth] > this.faultyRoute[depth]) {
				this.faultyRoute = route;
				this.fault = sign;
			}
		}
		else if (route[isEndpoint]) {
			if (typeof route[this.request.method] === "function") {
				this.found = true;
				return route[this.request.method];
			}
			this.faultyRoute = route;
		}
		else if (route[depth] > this.faultyRoute[depth]) {
			this.faultyRoute = route;
			this.fault = sign;
		}
	}
};
function Routes() {
	this[depth] = 0;
};
Routes.prototype.add = function add(path) {
	if (typeof path !== "string")
		throw new TypeError("path must be a String");
	let route = this;
	const destination = pathSplitter(path);
	for (let _depth = 0; _depth < destination.length; _depth++) {
		let sign = destination[_depth];
		if (httpMethods[sign])
			throw new Error(`The path "${path}" contains the http method ${sign}. ${config.name} does not allow using http methods in the path.`)
		if (sign[0] === ":")
			sign = "/" + sign.substr(1);
		if (!route[sign])
			route[sign] = { [depth]: _depth + 1 };
		route = route[sign];
	}
	route[isEndpoint] = true;
	return route;
};
Routes.prototype.walk = function walk(request) {
	const targets = pathSplitter(request.urlPathname);
	const pathFinder = new PathFinder(request);
	const api = pathFinder.pursue(this, targets);
	if (api) {
		request.socket._httpMessage.stats = api.stats;
		api(request, request.socket._httpMessage);
	}
	else if (pathFinder.faultyRoute[depth] < targets.length - 1)
		request.socket._httpMessage.onError(400, new Error(`Could not identify "/${pathFinder.fault}" in ${request.method} ${request.urlPathname}.`));
	else if (pathFinder.faultyRoute[isEndpoint])
		request.socket._httpMessage.onError(405, new Error(`Method ${request.method} not allowed for ${request.urlPathname}.`));
	else
		request.socket._httpMessage.onError(400, new Error(`The endpoint ${request.urlPathname} does not exist.`));
};
module.exports = Routes;