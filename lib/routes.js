"use strict";
const isEndpoint = Symbol("Is an endpoint");
const depth = Symbol("depth");
const noFaultyRoute = { [depth]: null };
const separate = uri => {
	const [, ...combo] = uri.split("/");
	return combo;
};
function RouteWalker(request) {
	request.params = {};
	this.request = request;
	this.found = false;
	this.faultyRoute = noFaultyRoute;
	this.fault = null;
};
RouteWalker.prototype.walk = function walk(route, combo) {
	let label;
	[label, ...combo] = combo;
	if (route[label])
		return this.walk(route[label], combo);
	else {
		if (label !== undefined) {
			for (const param in route)
				if (param[0] === "/") {
					const maybeAPI = this.walk(route[param], combo);
					if (this.found) {
						this.request.params[param.substr(1)] = label;
						return maybeAPI;
					}
				}
			if (route[depth] > this.faultyRoute[depth]) {
				this.faultyRoute = route;
				this.fault = label;
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
			this.fault = label;
		}
	}
};
function Routes() { };
Routes.prototype.add = function add(uri) {
	if (typeof uri !== "string")
		throw new TypeError("uri must be a String");
	let route = this;
	const combo = separate(uri);
	for (let _depth = 0; _depth < combo.length; _depth++) {
		let label = combo[_depth];
		if (label[0] === ":")
			label = "/" + label.substr(1);
		if (!route[label])
			Object.defineProperty(route, label, {
				value: Object.defineProperty({}, depth, { value: _depth }), enumerable: true
			});
		route = route[label];
	}
	Object.defineProperty(route, isEndpoint, { value: true });
	return route;
};
Routes.prototype.walk = function walk(request) {
	const combo = separate(request.parsedUrl.pathname);
	const routeWalker = new RouteWalker(request);
	const api = routeWalker.walk(this, combo);
	if (api)
		api(request, request.socket._httpMessage);
	else if (routeWalker.faultyRoute[depth] < combo.length - 1)
		request.onError(400, new Error(`Could not identify "/${routeWalker.fault}" in ${request.method} ${request.parsedUrl.pathname}.`));
	else if (routeWalker.faultyRoute[isEndpoint])
		request.onError(405, new Error(`Method ${request.method} not allowed for ${request.parsedUrl.pathname}.`));
	else
		request.onError(400, new Error(`The endpoint ${request.parsedUrl.pathname} does not exist.`));
};
module.exports = Routes;