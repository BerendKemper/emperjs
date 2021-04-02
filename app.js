"use strict";
const http = require("http");
const https = require("https");
const { HttpServer, HttpsServer } = require("framework/lib/server");
const Request = require("framework/lib/request");
const Response = require("framework/lib/response");
const RequestDataParsers = require("framework/lib/dataParser");
const ApiRegister = require("framework/lib/apiRegister");
const isParent = require("framework/lib/isParent");
const { serverKey } = require("./lib/accessKeys");
class App {
	#server;
	#apiRegister = new App.#ApiRegister();
	/**@param {String} protocol
	 * @param {Object} options
	 * @param {Object} options.logger
	 * @param {Function} options.logger.log
	 * @param {Function} options.logger.error */
	constructor(protocol, options = {}) {
		if (!(typeof options === "object" && options instanceof Array === false))
			throw new TypeError("Options must be an Object");
		if (protocol === http || protocol === "http")
			this.#server = new HttpServer(App.#serverOptions);
		else if (protocol === https || protocol === "https")
			this.#server = new HttpsServer(App.#serverOptions);
		else
			throw new TypeError("Protocol must be http or https");
		const { logger: { log = console.log, error = console.error } = {} } = options;
		this.#server.error = error;
		this.#server.log = log;
		this.#server.app = this;
		this.#server.initialise(serverKey);
	};
	/**
	 * @param {String} port 
	 * @param {String} hostname 
	 * @param {Number} backlog 
	 * @param {Function} listeningListener */
	listen(port = 8080, hostname = "127.0.0.1", backlog, listeningListener) {
		this.#server.onListening(serverKey, listeningListener);
		this.#server.listen(port, hostname, backlog);
	};
	/**@param {String} path 
	 * @param {Function} callback */
	get(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = this.#server.routes.add(path);
		if (route.GET)
			throw new Error(`There is already an API at GET ${path}`);
		route.GET = callback;
		callback.record = this.#apiRegister.register(path, "GET");
	};
	/**@param {String} path 
	 * @param {Function} callback */
	post(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = this.#server.routes.add(path);
		if (route.POST)
			throw new Error(`There is already an API at POST ${path}`);
		route.POST = callback;
		callback.record = this.#apiRegister.register(path, "POST");
	};
	/**@param {String} path 
	 * @param {Function} callback */
	put(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = this.#server.routes.add(path);
		if (route.PUT)
			throw new Error(`There is already an API at PUT ${path}`);
		route.PUT = callback;
		callback.record = this.#apiRegister.register(path, "PUT");
	};
	/**@param {String} path 
	 * @param {Function} callback */
	delete(path, callback) {
		if (typeof callback !== "function")
			throw new TypeError("Callback must be a function");
		const route = this.#server.routes.add(path);
		if (route.DELETE)
			throw new Error(`There is already an API at DELETE ${path}`);
		route.DELETE = callback;
		callback.record = this.#apiRegister.register(path, "DELETE");
	};
	loadApiRegister(register, reset) {
		if (typeof register !== "object" || Array.isArray(register))
			throw new TypeError("register is not an object");
		const apis = this.#apiRegister.apis();
		for (const path in apis) {
			const api = apis[path];
			register[path] = api;
			if (reset === true)
				for (const method in api)
					api[method].reset();
		}
		this.#apiRegister = new App.#ApiRegister(register);
	};
	get registeredApis() {
		return this.#apiRegister.apis;
	};
	get requestDataParser() {
		return requestDataParser;
	};
	static get #serverOptions() {
		return { IncomingMessage: App.#IncomingMessage, ServerResponse: App.#ServerResponse };
	}
	static #IncomingMessage = Request;
	static get IncomingMessage() {
		return App.#IncomingMessage;
	};
	static set IncomingMessage(IncomingMessage) {
		isParent(IncomingMessage, Request);
		App.#IncomingMessage = IncomingMessage;
	};
	static #ServerResponse = Response;
	static get ServerResponse() {
		return App.#ServerResponse;
	};
	static set ServerResponse(ServerResponse) {
		isParent(ServerResponse, Response);
		App.#ServerResponse = ServerResponse;
	};
	static #ApiRegister = ApiRegister;
	static get ApiRegister() {
		return App.#ApiRegister;
	};
	static set ApiRegister(OwnApiRegister) {
		isParent(OwnApiRegister, ApiRegister);
		App.#ApiRegister = OwnApiRegister;
	};
};
const requestDataParser = Request.dataParsers = new RequestDataParsers();
module.exports = App;