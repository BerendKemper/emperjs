"use strict";
const isEndpoint = Symbol("Is an endpoint");
const depth = Symbol("depth");
const noFaultyRoute = { [depth]: null };
const separate = uri => {
	const [, ...combo] = uri.split("/");
	return combo;
};
function PathFinder(request) {
	request.params = {};
	this.request = request;
	this.found = false;
	this.faultyRoute = noFaultyRoute;
	this.fault = null;
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
				return this.request.api = route[this.request.method];
			}
			this.faultyRoute = route;
		}
		else if (route[depth] > this.faultyRoute[depth]) {
			this.faultyRoute = route;
			this.fault = sign;
		}
	}
};
function Routes() { };
Routes.prototype.add = function add(uri) {
	if (typeof uri !== "string")
		throw new TypeError("uri must be a String");
	let route = this;
	const destination = separate(uri);
	for (let _depth = 0; _depth < destination.length; _depth++) {
		let sign = destination[_depth];
		if (sign[0] === ":")
			sign = "/" + sign.substr(1);
		if (!route[sign])
			Object.defineProperty(route, sign, {
				value: Object.defineProperty({}, depth, { value: _depth }), enumerable: true
			});
		route = route[sign];
	}
	Object.defineProperty(route, isEndpoint, { value: true });
	return route;
};
Routes.prototype.walk = function walk(request) {
	const targets = separate(request.parsedUrl.pathname);
	const pathFinder = new PathFinder(request);
	const api = pathFinder.pursue(this, targets);
	if (api)
		api(request, request.socket._httpMessage);
	else if (pathFinder.faultyRoute[depth] < targets.length - 1)
		request.onError(400, new Error(`Could not identify "/${pathFinder.fault}" in ${request.method} ${request.parsedUrl.pathname}.`));
	else if (pathFinder.faultyRoute[isEndpoint])
		request.onError(405, new Error(`Method ${request.method} not allowed for ${request.parsedUrl.pathname}.`));
	else
		request.onError(400, new Error(`The endpoint ${request.parsedUrl.pathname} does not exist.`));
};
module.exports = Routes;