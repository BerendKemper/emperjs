"use strict";
const http = require("http");
const https = require("https");
const { HttpServer, HttpsServer } = require("./server");
const Request = require("./request");
const Response = require("./response");
const RequestDataParsers = require("./dataParser");
const ApiStats = require("./apiStats");
class App {
	/**@param {String} protocol
	 * @param {Object} options
	 * @param {Object} options.logger
	 * @param {Function} options.logger.log
	 * @param {Function} options.logger.error */
	constructor(protocol, options = {}) {
		if (!(typeof options === "object" && options instanceof Array === false))
			throw new TypeError("Options must be an Object");
		if (protocol === http || protocol === "http")
			var appServer = new HttpServer(this.serverOptions);
		else if (protocol === https || protocol === "https")
			var appServer = new HttpsServer(this.serverOptions);
		else
			throw new TypeError("Protocol must be http or https");
		appApiStats.set(this, {});
		const { logger: { log = console.log, error = console.error } = {} } = options;
		appServer.error = error;
		appServer.app = this;
		appServer.log = log;
		appServer.initialise();
		server.set(this, appServer);
	};
	get apiStats() {
		return appApiStats.get(this);
	};
	/**@param {Object} external */
	loadApiStats(external) {
		appApiStats.set(this, Object.assign(external, Object.assign(appApiStats.get(this), external)));
	};
	/**@param {Object} external */
	loadResetApiStats(external) {
		const _appApiStats = appApiStats.get(this);
		for (const path in _appApiStats) {
			const endpointStats = _appApiStats[path];
			external[path] = endpointStats;
			for (const method in endpointStats)
				endpointStats[method].reset();
		}
		appApiStats.set(this, external);
	};
	/**@param {String} port 
	 * @param {String} hostname 
	 * @param {Number} backlog 
	 * @param {Function} listeningListener */
	listen(port, hostname = "127.0.0.1", backlog, listeningListener) {
		const appServer = server.get(this);
		appServer.listen(port, hostname, backlog, listeningListener = appServer.onListening);
	};
	/**@param {String} path 
	 * @param {Function} callback */
	get(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = server.get(this).routes.add(path);
		if (route.GET)
			throw new Error(`There is already an API at GET ${path}`);
		route.GET = callback;
		callback.stats = new ApiStats(appApiStats.get(this), path, "GET");
	};
	/**@param {String} path 
	 * @param {Function} callback */
	post(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = server.get(this).routes.add(path);
		if (route.POST)
			throw new Error(`There is already an API at POST ${path}`);
		route.POST = callback;
		callback.stats = new ApiStats(appApiStats.get(this), path, "POST");
	};
	/**@param {String} path 
	 * @param {Function} callback */
	put(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = server.get(this).routes.add(path);
		if (route.PUT)
			throw new Error(`There is already an API at PUT ${path}`);
		route.PUT = callback;
		callback.stats = new ApiStats(appApiStats.get(this), path, "PUT");
	};
	/**@param {String} path 
	 * @param {Function} callback */
	delete(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = server.get(this).routes.add(path);
		if (route.DELETE)
			throw new Error(`There is already an API at DELETE ${path}`);
		route.DELETE = callback;
		callback.stats = new ApiStats(appApiStats.get(this), path, "DELETE");
	};
};
const server = new Map();
const appApiStats = new Map();
App.prototype.serverOptions = { IncomingMessage: Request, ServerResponse: Response };
App.prototype.requestDataParsers = Request.prototype.dataParsers = new RequestDataParsers();
module.exports = App;