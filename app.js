"use strict";
const { HttpServer, HttpsServer } = require("./lib/server");
const Request = require("./lib/request");
const Response = require("./lib/response");
const ApiRegister = require("./lib/apiRegister");
const isDerived = require("is-derived");
const { isObject } = require("./lib/common");
const logger = require("./lib/logger");
const _mimetypes = require("./lib/fileTypes");
let IncomingMessage = Request;
let ServerResponse = Response;
class App {
	#server;
	#apiRegister = new ApiRegister();
	/**
	 * @param {String} protocol
	 * @param {Object} options
	 * @param {Object} options.logger
	 * @param {Function} options.logger.log
	 * @param {Function} options.logger.error */
	constructor(protocol, options = {}) {
		isObject(options);
		if (protocol === "http")
			this.#server = new HttpServer({ IncomingMessage, ServerResponse });
		else if (protocol === "https")
			this.#server = new HttpsServer({ IncomingMessage, ServerResponse });
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
	//
	// server options
	static get IncomingMessage() {
		return IncomingMessage;
	};
	static set IncomingMessage(OwnIncomingMessage) {
		if (OwnIncomingMessage === null)
			IncomingMessage = Request;
		else if (!isDerived(OwnIncomingMessage, Request))
			throw TypeError(`The parameter IncomingMessage is not derived from Request`);
		IncomingMessage = OwnIncomingMessage;
	};
	//
	static get ServerResponse() {
		return ServerResponse;
	};
	static set ServerResponse(OwnServerResponse) {
		if (OwnServerResponse === null)
			ServerResponse = Response;
		else if (!isDerived(OwnServerResponse, Response))
			throw TypeError(`The parameter ServerResponse is not a child of Response`);
		ServerResponse = OwnServerResponse;
	};
	//
	// api record
	static get ApiRecord() {
		return ApiRegister.ApiRecord;
	};
	static set ApiRecord(OwnApiRecord) {
		ApiRegister.ApiRecord = OwnApiRecord;
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