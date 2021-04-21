"use strict";
const { HttpServer, HttpsServer } = require("./lib/server");
const Request = require("./lib/request");
const Response = require("./lib/response");
const ApiRegister = require("./lib/apiRegister");
const isDerived = require("is-derived");
const { isObject } = require("./lib/common");
const logger = require("./lib/logger");
const _mimetypes = require("./lib/fileTransfer");
class App {
	#server;
	#apiRegister = new App.#ApiRegister();
	/**
	 * @param {String} protocol
	 * @param {Object} options
	 * @param {Object} options.logger
	 * @param {Function} options.logger.log
	 * @param {Function} options.logger.error */
	constructor(protocol, options = {}) {
		isObject(options);
		if (protocol === "http")
			this.#server = new HttpServer(App.#serverOptions);
		else if (protocol === "https")
			this.#server = new HttpsServer(App.#serverOptions);
		else
			throw new TypeError("Protocol must be http or https");
		this.#server.initialize();
	};
	/**
	 * @param {Object} options
	 * @param {String} options.port 
	 * @param {String} options.hostname 
	 * @param {Function} options.listeningListener
	 **/
	listen(options = {}) {
		const { port, hostname, listeningListener } = options;
		this.#server.listen(port, hostname, listeningListener);
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
		callback.apiRecord = this.#apiRegister.register(path, "GET");
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
		callback.apiRecord = this.#apiRegister.register(path, "POST");
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
		callback.apiRecord = this.#apiRegister.register(path, "PUT");
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
		callback.apiRecord = this.#apiRegister.register(path, "DELETE");
	};
	/**
	 * 
	 * @param {Object} register 
	 * @param {Boolean} reset 
	 */
	loadApiRegister(register, reset) {
		isObject(register);
		const apis = this.#apiRegister.apis;
		for (const path in apis) {
			const api = apis[path];
			const loadingApi = register[path];
			register[path] = api;
			if (reset === true)
				for (const method in api)
					api[method].reset();
			else if (loadingApi)
				for (const method in api)
					api[method].from(loadingApi[method]);
		}
		this.#apiRegister.load(register);
	};
	get apis() {
		return this.#apiRegister.apis;
	};

	// static
	// server options
	static get #serverOptions() {
		return { IncomingMessage: App.#IncomingMessage, ServerResponse: App.#ServerResponse };
	};
	static #IncomingMessage = Request;
	static get IncomingMessage() {
		return App.#IncomingMessage;
	};
	static set IncomingMessage(IncomingMessage) {
		if (!isDerived(IncomingMessage, Request))
			throw TypeError(`The parameter IncomingMessage is not a child of Request`);
		App.#IncomingMessage = IncomingMessage;
	};
	//
	static #ServerResponse = Response;
	static get ServerResponse() {
		return App.#ServerResponse;
	};
	static set ServerResponse(ServerResponse) {
		if (!isDerived(ServerResponse, Response))
			throw TypeError(`The parameter ServerResponse is not a child of Response`);
		App.#ServerResponse = ServerResponse;
	};
	//
	// api register
	static #ApiRegister = ApiRegister;
	static get ApiRegister() {
		return App.#ApiRegister;
	};
	static set ApiRegister(OwnApiRegister) {
		if (!isDerived(OwnApiRegister, ApiRegister))
			throw TypeError(`The parameter OwnApiRegister is not a child of ApiRegister`);
		App.#ApiRegister = OwnApiRegister;
	};
	//
	// logger
	static get logger() {
		return logger;
	};
	//
	// logger
	static get mimetypes() {
		return _mimetypes;
	};
	static set mimetypes(mimetypes) {
		isObject(mimetypes);
		for (const type in mimetypes)
			_mimetypes[type] = mimetypes[type];
	};
};
module.exports = App;