"use strict";
const { HttpServer, HttpsServer } = require("./lib/server");
const Request = require("./lib/request");
const Response = require("./lib/response");
const ApiRegister = require("./lib/apiRegister");
const isDerived = require("is-derived");
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
	 **/
	constructor(protocol, options = {}) {
		if (Object.prototype.toString.call(options) !== "[object Object]") throw new TypeError("param must be an object");
		options.IncomingMessage = IncomingMessage;
		options.ServerResponse = ServerResponse;
		if (protocol === "http")
			this.#server = new HttpServer(options);
		else if (protocol === "https")
			this.#server = new HttpsServer(options);
		else
			throw new TypeError("Protocol must be http or https");
	};
	/**
	 * @param {Object} options
	 * @param {String} options.port
	 * @param {String} options.hostname
	 * @param {Function} options.listeningListener
	 **/
	listen(options = {}) {
		let { port = 8080, hostname = "127.0.0.1", listeningListener = () => console.log(`Listening on: ${this.#server.url}`) } = options;
		this.#server.listen(port, hostname, null, listeningListener);
	};
	#publishHttpMethod(path, method, callback) {
		if (typeof callback !== "function") throw new TypeError("Callback must be a function");
		const route = this.#server.routes.add(path);
		if (route[method]) throw new Error(`There is already an API at ${method} ${path}`);
		route[method] = callback;
		callback.apiRecord = this.#apiRegister.register(path, method);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	delete(path, callback) {
		this.#publishHttpMethod(path, "DELETE", callback);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	get(path, callback) {
		this.#publishHttpMethod(path, "GET", callback);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	head(path, callback) {
		this.#publishHttpMethod(path, "HEAD", callback);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	options(path, callback) {
		this.#publishHttpMethod(path, "OPTIONS", callback);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	patch(path, callback) {
		this.#publishHttpMethod(path, "PATCH", callback);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	post(path, callback) {
		this.#publishHttpMethod(path, "POST", callback);
	};
	/**
	 * @param {String} path
	 * @param {Function} callback */
	put(path, callback) {
		this.#publishHttpMethod(path, "PUT", callback);
	};
	/**
	 * @param {Object} register
	 * @param {Boolean} reset
	 */
	loadApiRegister(register, reset) {
		if (Object.prototype.toString.call(register) !== "[object Object]") throw new TypeError("param must be an object");
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
	get url() {
		return this.#server.url;
	};
	get apis() {
		return this.#apiRegister.apis;
	};
	static get IncomingMessage() {
		return IncomingMessage;
	};
	/**
	 * Set this value to null in order to reset it to the base Request class.
	 */
	static set IncomingMessage(OwnIncomingMessage) {
		if (OwnIncomingMessage === null) return IncomingMessage = Request;
		else if (!isDerived(OwnIncomingMessage, Request)) throw TypeError(`The parameter IncomingMessage is not derived from Request`);
		IncomingMessage = OwnIncomingMessage;
	};
	static get ServerResponse() {
		return ServerResponse;
	};
	/**
	 * Set this value to null in order to reset it to the base Response class.
	 */
	static set ServerResponse(OwnServerResponse) {
		if (OwnServerResponse === null) return ServerResponse = Response;
		else if (!isDerived(OwnServerResponse, Response)) throw TypeError(`The parameter ServerResponse is not a child of Response`);
		ServerResponse = OwnServerResponse;
	};
	static get ApiRecord() {
		return ApiRegister.ApiRecord;
	};
	/**
	 * Set this value to null in order to reset it to the base ApiRecord class.
	 */
	static set ApiRecord(OwnApiRecord) {
		ApiRegister.ApiRecord = OwnApiRecord;
	};
	static get logger() {
		return logger;
	};
	static get mimetypes() {
		return _mimetypes;
	};
	static set mimetypes(mimetypes) {
		if (Object.prototype.toString.call(mimetypes) !== "[object Object]") throw new TypeError("param must be an object");
		for (const type in mimetypes)
			_mimetypes[type] = mimetypes[type];
	};
};
module.exports = App;