"use strict";
const { HttpServer, HttpsServer } = require("./lib/server");
const Request = require("./lib/request");
const Response = require("./lib/response");
const ApiRegister = require("./lib/apiRegister");
const isDerived = require("is-derived");
const logger = require("./lib/logger");
const _mimetypes = require("./lib/fileTypes");
const socket = require("./lib/socket");
let EmperRequest = Request;
let EmperResponse = Response;
/**
 * @callback requestCallback
 * @param {Request} request
 * @param {Response} response
 */
class App {
    #server = null;
    #apiRegister = new ApiRegister();
    /**
     * @param {String} protocol
     * @param {{ insecureHTTPParser?: boolean;
     * maxHeaderSize?: number; }} options
     **/
    constructor(protocol, options = {}) {
        if (Object.prototype.toString.call(options) !== "[object Object]") throw new TypeError("param must be an object");
        options.IncomingMessage = EmperRequest;
        options.ServerResponse = EmperResponse;
        if (protocol === "http")
            this.#server = new HttpServer(options);
        else if (protocol === "https")
            this.#server = new HttpsServer(options);
        else
            throw new TypeError("Protocol must be http or https");
    };
    /**
     * @param {{ port?: string;
     * hostname?: string;
     * listeningListener?: function; }} options
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
     * @param {string} path
     * @param {requestCallback} callback */
    delete(path, callback) {
        this.#publishHttpMethod(path, "DELETE", callback);
    };
    /**
     * @param {string} path
     * @param {requestCallback} callback */
    get(path, callback) {
        this.#publishHttpMethod(path, "GET", callback);
    };
    /**
     * @param {string} path
     * @param {requestCallback} callback */
    head(path, callback) {
        this.#publishHttpMethod(path, "HEAD", callback);
    };
    /**
     * @param {string} path
     * @param {requestCallback} callback */
    options(path, requestCallback) {
        this.#publishHttpMethod(path, "OPTIONS", callback);
    };
    /**
     * @param {string} path
     * @param {requestCallback} callback */
    patch(path, callback) {
        this.#publishHttpMethod(path, "PATCH", callback);
    };
    /**
     * @param {string} path
     * @param {requestCallback} callback */
    post(path, callback) {
        this.#publishHttpMethod(path, "POST", callback);
    };
    /**
     * @param {string} path
     * @param {requestCallback} callback */
    put(path, callback) {
        this.#publishHttpMethod(path, "PUT", callback);
    };
    /**
     * @param {object} register
     * @param {boolean} reset
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
        return EmperRequest;
    };
    /** Set this value to null in order to reset it to the base Request class. */
    static set IncomingMessage(OwnIncomingMessage) {
        if (OwnIncomingMessage === null) return EmperRequest = Request;
        else if (!isDerived(OwnIncomingMessage, Request)) throw TypeError(`The parameter IncomingMessage is not derived from Request`);
        EmperRequest = OwnIncomingMessage;
    };
    static get ServerResponse() {
        return EmperResponse;
    };
    /** Set this value to null in order to reset it to the base Response class. */
    static set ServerResponse(OwnServerResponse) {
        if (OwnServerResponse === null) return EmperResponse = Response;
        else if (!isDerived(OwnServerResponse, Response)) throw TypeError(`The parameter ServerResponse is not a child of Response`);
        EmperResponse = OwnServerResponse;
    };
    static get Socket() {
        return socket.Socket;
    };
    static set Socket(OwnSocket) {
        socket.Socket = OwnSocket;
    };
    static get ApiRecord() {
        return ApiRegister.ApiRecord;
    };
    /** Set this value to null in order to reset it to the base ApiRecord class. */
    static set ApiRecord(OwnApiRecord) {
        ApiRegister.ApiRecord = OwnApiRecord;
    };
    static get logger() {
        return logger;
    };
    static get mimetypes() {
        return _mimetypes;
    };
    /** Add mimetypes to the dictionary. The mimetypes enables detecting the content-type by the extension from a file and is used in the response's sendFile method */
    static set mimetypes(mimetypes) {
        if (Object.prototype.toString.call(mimetypes) !== "[object Object]") throw new TypeError("param must be an object");
        for (const type in mimetypes)
            _mimetypes[type] = mimetypes[type];
    };
};
module.exports = App;