"use strict";
const http = require("http");
const https = require("https");
const { HttpServer, HttpsServer } = require("./server");
const Request = require("./request");
const Response = require("./response");
class App {
	constructor(protocol, options = {}, requestListener) {
		if (!(typeof options === "object" && options instanceof Array === false))
			throw new TypeError("Options must be an Object");
		if (protocol === http)
			var appServer = new HttpServer(this.serverOptions, requestListener);
		else if (protocol === https)
			var appServer = new HttpsServer(this.serverOptions, requestListener);
		else
			throw new TypeError("Protocol must be http or https");
		const { logger: { log = console.log, error = console.error } = {} } = options;
		appServer.error = error;
		appServer.app = this;
		appServer.log = log;
		appServer.initialise();
		server.set(this, appServer);
	}
	listen(port, hostname = "127.0.0.1", backlog, listeningListener) {
		server.get(this).$listen(port, hostname, backlog, listeningListener);
	};
	get(uri, callback) {
		this.routes.add(uri, { method: "GET", enumerable: true, value: callback });
	}
	post(uri, callback) {
		this.routes.add(uri, { method: "POST", enumerable: true, value: callback });
	}
	put(uri, callback) {
		this.routes.add(uri, { method: "PUT", enumerable: true, value: callback });
	}
	delete(uri, callback) {
		this.routes.add(uri, { method: "DELETE", enumerable: true, value: callback });
	}
};
const server = new WeakMap();
App.prototype.serverOptions = Object.freeze({ IncomingMessage: Request, ServerResponse: Response });
module.exports = App;