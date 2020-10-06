"use strict";
const separate = uri => {
	const [, ...combo] = uri.split("/");
	return combo;
};
function Routes() { };
Routes.prototype.add = function add(uri) {
	if (typeof uri !== "string")
		throw new TypeError("uri must be a String");
	let route = this;
	for (let label of separate(uri)) {
		if (label[0] === ":")
			label = "/" + label.substr(1);
		if (!route[label])
			Object.defineProperty(route, label, {
				value: {}, enumerable: true
			});
		route = route[label];
	}
	return route;
};
Routes.prototype.walk = function walk(request) {
	const walker = new Walker(request);
	walker.walk(this, separate(request.parsedUrl.pathname))
};
module.exports = Routes;




function Walker(request) {
	const params = {};
	this.addParam = (key, value) => params[key] = value;
	request.params = params;
	this.method = request.method;
	this.doubts = -1;
	this.found = false;
	this.uncertainties = [];
};
Walker.prototype.walk = function walk(route, combo = separate(this.uri)) {
	const [label, ...combo] = combo;
	if (route[label])
		return this.find(route[label], combo);
	else {
		this.doubts++;
		if (label === undefined && typeof route[this.method] === "function") {
			this.found = true;
			return route;
		}
		else if (label !== undefined) {
			for (const param in route) {
				if (param[0] === "/") {
					const maybeRoute = this.find(route[param], combo);
					if (this.found) {
						this.addParam(param.substr(1), label);
						return maybeRoute;
					}
				}
			}
		}
		if (!this.found) {
			this.uncertainties[this.doubts] = label;
			if (this.doubts === 0) {
				const fault = this.uncertainties.pop();
				if (fault !== undefined)
					throw new Exception(400, 'Could not identify "' + fault +
						'" in ' + this.method + " " + this.uri);
				else
					throw new Exception(405, "Method " + this.method +
						" not allowed for " + this.uri);
			}
		}
		this.doubts--;
	}
};


// 'add': {
//     value(uri) {
//         if (typeof uri !== "string")
//             throw new TypeError("uri must be a String");
//         let route = routes;
//         for (let label of separate(uri)) {
//             if (label[0] === ":")
//                 label = "/" + label.slice(1);
//             if (!route[label])
//                 Object.defineProperty(route, label, {
//                     value: {}, enumerable: true
//                 });
//             route = route[label];
//         }
//         return route;
//     }
// }