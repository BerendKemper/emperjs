"use strict";
const http = require("http");
const https = require("https");
const { HttpServer, HttpsServer } = require("./server");
const Request = require("./request");
const Response = require("./response");
const RequestDataParsers = require("./dataParser");
class App {
	constructor(protocol, options = {}) {
		if (!(typeof options === "object" && options instanceof Array === false))
			throw new TypeError("Options must be an Object");
		if (protocol === http || protocol === "http")
			var appServer = new HttpServer(this.serverOptions);
		else if (protocol === https || protocol === "https")
			var appServer = new HttpsServer(this.serverOptions);
		else
			throw new TypeError("Protocol must be http or https");
		this.serverOptions.IncomingMessage.prototype.dataParsers = this.requestDataParsers;
		const { logger: { log = console.log, error = console.error } = {} } = options;
		appServer.error = error;
		appServer.app = this;
		appServer.log = log;
		appServer.initialise();
		server.set(this, appServer);
	};
	listen(port, hostname = "127.0.0.1", backlog, listeningListener) {
		server.get(this).$listen(port, hostname, backlog, listeningListener);
	};
	get(uri, callback) {
		const endpoint = server.get(this).routes.add(uri);
		Object.defineProperty(endpoint, "GET", { enumerable: true, value: callback });
	};
	post(uri, callback) {
		const endpoint = server.get(this).routes.add(uri);
		Object.defineProperty(endpoint, "POST", { enumerable: true, value: callback });
	};
	put(uri, callback) {
		const endpoint = server.get(this).routes.add(uri);
		Object.defineProperty(endpoint, "PUT", { enumerable: true, value: callback });
	};
	delete(uri, callback) {
		const endpoint = server.get(this).routes.add(uri);
		Object.defineProperty(endpoint, "DELETE", { enumerable: true, value: callback });
	};
};
const server = new WeakMap();
App.prototype.serverOptions = Object.freeze({ IncomingMessage: Request, ServerResponse: Response });
App.prototype.requestDataParsers = new RequestDataParsers();
Object.freeze(App.prototype);
module.exports = App;