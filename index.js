"use strict";
const http = require("http"); // console.log(http.STATUS_CODES); console.log(http.METHODS);
const App = require("./lib/app");

let app = new App(http);
app.listen(8080);
app.get("/", (request, response) => {

});
app.get("/v1/tickets/guidion", (request, response) => {

});
app.get("/v1/tickets/:id/guidion", (request, response) => {

});
app.put("/v1/tickets/:id/guidion", (request, response) => {

});
console.log("routes:", app.routes);

// console.log(new URL("/"));
// console.log(new URL("/test/:id/aap"));
// console.log(new URL("/mongol/"));


/*
const createWebApp = await async function loadWebApp() {
	const webApp = await async function request(request, response) {
		return new Promise((resolve, reject) => {
			let data = [];
			const doRequest = () => {
				const { headers, method, url } = request;
				logger.log(method, "url: " + url);
				response.on("close", () => logger.log("CLOSED", "url: " + url));
				try {
					if (data.length === 0)
						data = {};
					else {
						const dataParser = dataParsers[headers['content-type']];
						if (!dataParser)
							throw new Error("content-type not supported");
						data = dataParser(Buffer.concat(data).toString());
					}
					request.body = data;
					return routes.handle(request, response);
				} catch (error) {
					if (error instanceof Exception)
						error.handle(response);
					else
						new Exception(400, error.message).handle(response);
				}
			};
			if (request instanceof _http.IncomingMessage) {
				request.on("data", chunk => data.push(chunk));
				request.on("s", () => resolve(doRequest()));
			}
			else
				resolve(doRequest());
		});
	};
	const routes = function loadRoutes() {
		const separate = uri => {
			const [, ...combo] = uri.split("/");
			return combo;
		};
		const routes = {};
		const router = Object.defineProperties(() => routes, {
			'handle': {
				value: function loadHandle() {
					class Router {
						constructor(request) {
							const { pathname, query } = _url.parse(request.url);
							this.uri = pathname;
							request.query = query;
							const params = {};
							this.addParam = (key, value) => params[key] = value;
							request.params = params;
							this.method = request.method;
							this.depth = 0;
							this.deepFound = false;
							this.falsyLabel = [];
						}
					};
					Object.defineProperty(Router.prototype, 'find', {
						value(route, combo = separate(this.uri)) {
							const label = combo.shift();
							const foundRoute = route[label];
							if (!foundRoute) {
								this.depth++;
								let found = false;
								if (label === undefined && typeof route[this.method] === "function") {
									this.deepFound = true;
									found = true;
								}
								else {
									for (const param in route) {
										if (label !== undefined && param[0] === "/") {
											const _deeperRoute = this.find(route[param], Array.from(combo));
											if (this.deepFound) {
												route = _deeperRoute;
												found = true;
												this.addParam(param.slice(1), label);
												break;
											}
										}
									}
								}
								if (!found) {
									const falsyLabel = this.falsyLabel;
									falsyLabel[this.depth] = label;
									if (this.depth === 1) {
										const fault = falsyLabel.pop();
										if (fault !== undefined)
											throw new Exception(400, 'Could not identify "' + fault +
												'" in ' + this.method + " " + this.uri);
										else
											throw new Exception(405, "Method " + this.method +
												" not allowed for " + this.uri);
									}
								}
								this.depth--;
							}
							else
								route = this.find(foundRoute, Array.from(combo));
							return route;
						}
					});
					return (request, response) => {
						const router = new Router(request);
						try {
							const route = router.find(routes);
							const method = route[request.method];
							return method(request, response);
						} catch (error) {
							if (error instanceof Exception)
								error.handle(response);
							else
								new Exception(400, error.message).handle(response);
						}
					}
				}()
			},
			'add': {
				value(uri) {
					if (typeof uri !== "string")
						throw new TypeError("uri must be a String");
					let route = routes;
					for (let label of separate(uri)) {
						if (label[0] === ":")
							label = "/" + label.slice(1);
						if (!route[label])
							Object.defineProperty(route, label, {
								value: {}, enumerable: true
							});
						route = route[label];
					}
					return route;
				}
			}
		});
		return router;
	}();
	const apiJSON = await new FileJSON("temp/api.json");
	const tabs22 = new IndentModel({ spaces: 22 });
	class ApiJSON {
		constructor(method, uri) {
			const fullUri = method + " " + uri;
			if (apiJSON[fullUri] === undefined)
				apiJSON[fullUri] = { counter: 0, bytes: 0 };
			apiJSON[fullUri] = Object.assign(this, apiJSON[fullUri]);
			return this;
		}
		toFormat() {
			return tabs22.tabify("counter: " + dotNumNotation(this.counter),
				"bytes: " + e3sBytesNotation(this.bytes));
		}
	};
	const prototypeApiJSON = ApiJSON.prototype;
	const get = (uri, callback) => {
		if (typeof callback !== "function")
			return console.log(new TypeError("callback must be a function"));
		Object.defineProperty(routes.add(uri), 'GET', { value: callback, enumerable: true });
		callback.JSON = new ApiJSON("GET", uri);
	};
	const post = (uri, callback) => {
		if (typeof callback !== "function")
			return console.log(new TypeError("callback must be a function"));
		Object.defineProperty(routes.add(uri), 'POST', { value: callback, enumerable: true });
		callback.JSON = new ApiJSON("POST", uri);
	};
	const put = (uri, callback) => {
		if (typeof callback !== "function")
			return console.log(new TypeError("callback must be a function"));
		Object.defineProperty(routes.add(uri), 'PUT', { value: callback, enumerable: true });
		callback.JSON = new ApiJSON("PUT", uri);
	};
	const del = (uri, callback) => {
		if (typeof callback !== "function")
			return console.log(new TypeError("callback must be a function"));
		Object.defineProperty(routes.add(uri), 'DELETE', { value: callback, enumerable: true });
		callback.JSON = new ApiJSON("DELETE", uri);
	};
	const tabs85 = new IndentModel({ spaces: 85 });
	const printRoutes = callback => {
		apiJSON.write().then(() => {
			let print = "App Routes:";
			(function subRoutes(spaces, route) {
				for (const label of Object.keys(route)) {
					const subRoute = route[label];
					if (typeof subRoute === "function") {
						const funcStr = subRoute.toString();
						const findNewLine = funcStr.indexOf("\n");
						if (findNewLine !== -1)
							var printf = funcStr.substring(0, findNewLine) + " callback }";
						else
							var printf = funcStr.substring(0, funcStr.indexOf("=>") + 2) + " callback";
						print += "\n" + tabs85.tabify(spaces + label + ": " + printf, subRoute.JSON.toFormat());
					}
					else {
						print += "\n" + spaces + "/" + label.replace("/", ":");
						subRoutes(spaces + "    ", subRoute);
					}
				}
			}("", routes()));
			print += "\n" + "END Routes";
			callback(print);
		});
	};
	Object.defineProperties(webApp, {
		'get': { value: get, enumerable: true },
		'post': { value: post, enumerable: true },
		'put': { value: put, enumerable: true },
		'delete': { value: del, enumerable: true },
		'printRoutes': { value: printRoutes, enumerable: true }
	});
	return () => webApp;
}();
const app = createWebApp();
//*/


