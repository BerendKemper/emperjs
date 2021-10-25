"use strict";
const RequestFactory = require("./lib/request");
const ResponseFactory = require("./lib/response");
const SocketFactory = require("./lib/socket");
const WebSocketFactory = require("./lib/webSocket");
const ApiRegisterFactory = require("./lib/apiRegister");
const _mimetypes = require("emperjs/lib/fileTypes");
const Logger = require("./lib/logger");
const Routes = require("./lib/routes");
const isDerived = require("is-derived");
/**@type {import("emperjs/emper").AppFactory}*/
module.exports = (protocol, options) => {
    var http = require("http");
    protocol === "https" ? http = require("https") : protocol = "http";
    const logger = options?.logger === false ? null : new Logger();
    const routes = new Routes();
    const context = { logger, routes };
    const Request = RequestFactory(context);
    const Response = ResponseFactory(context);
    let EmperRequest = Request;
    const requestListener = Request.listener();
    let EmperResponse = Response;
    const SocketModule = SocketFactory(context);
    const listeningListener = SocketModule.listeningListener();
    const upgradeListener = WebSocketFactory(context);
    /* function onConnection(socket) { }; */
    /* function onError(error) { }; */
    const ApiRegister = ApiRegisterFactory();
    const apiRegister = new ApiRegister();
    let app = false;
    return class App extends http.Server {
        constructor(options = {}) {
            if (app === (app = true)) throw new Error("An App can only create one instance");
            if (Object.prototype.toString.call(options) !== "[object Object]") throw new TypeError("param must be an object");
            options.IncomingMessage = EmperRequest;
            options.ServerResponse = EmperResponse;
            super(options, requestListener);
            /* this.on("connection", onConnection); */
            /* this.on("error", onError); */
            this.once("listening", listeningListener);
            // this.on("upgrade", upgradeListener);
        }
        listen(options = {}, listeningListener = () => console.log(`Listening on: ${this.url}`)) {
            const { hostname: host = "127.0.0.1", port = protocol === "https" ? 8081 : 8080, backlog = null } = options ?? {};
            return super.listen({ port, host, backlog }, listeningListener);
        }
        delete(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "DELETE", callback).apiRecord = apiRegister.register(path, "DELETE");
        }
        get(path, callback, record = true) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "GET", callback)
            if (record) callback.apiRecord = apiRegister.register(path, "GET");
        }
        head(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "HEAD", callback).apiRecord = apiRegister.register(path, "HEAD");
        }
        options(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "OPTIONS", callback).apiRecord = apiRegister.register(path, "OPTIONS");
        }
        patch(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "PATCH", callback).apiRecord = apiRegister.register(path, "PATCH");
        }
        post(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "POST", callback).apiRecord = apiRegister.register(path, "POST");
        }
        put(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.add(path, "PUT", callback).apiRecord = apiRegister.register(path, "PUT");
        }
        loadApiRegister(register, reset) {
            if (Object.prototype.toString.call(register) !== "[object Object]") throw new TypeError("param must be an object");
            const apis = apiRegister.apis;
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
            apiRegister.load(register);
            return this;
        }
        destroyUnusedRecords() {
            const apis = apiRegister.apis;
            for (const path in apis) {
                const api = apis[path];
                for (const method in api)
                    if (!routes.has(path, method))
                        delete (api[method]);
                if (Object.keys(api).length === 0)
                    delete (apis[path]);
            }
            return this;
        }
        get url() {
            const address = this.address();
            return protocol + "://" + address.address + ":" + address.port;
        }
        get apis() {
            return apiRegister.apis;
        }
        static get IncomingMessage() {
            return EmperRequest;
        }
        static set IncomingMessage(OwnIncomingMessage) {
            if (OwnIncomingMessage === null) return EmperRequest = Request;
            else if (!isDerived(OwnIncomingMessage, Request)) throw TypeError(`The parameter IncomingMessage is not derived from Request`);
            EmperRequest = OwnIncomingMessage;
        }
        static get ServerResponse() {
            return EmperResponse;
        }
        static set ServerResponse(OwnServerResponse) {
            if (OwnServerResponse === null) return EmperResponse = Response;
            else if (!isDerived(OwnServerResponse, Response)) throw TypeError(`The parameter ServerResponse is not a child of Response`);
            EmperResponse = OwnServerResponse;
        }
        static get Socket() {
            return SocketModule.EmperSocket;
        }
        static set Socket(OwnSocket) {
            SocketModule.EmperSocket = OwnSocket;
        }
        static get ApiRecord() {
            return ApiRegister.ApiRecord;
        }
        static set ApiRecord(OwnApiRecord) {
            ApiRegister.ApiRecord = OwnApiRecord;
        }
        static get logger() {
            return logger;
        }
        static get mimetypes() {
            return _mimetypes;
        }
        static set mimetypes(mimetypes) {
            if (Object.prototype.toString.call(mimetypes) !== "[object Object]") throw new TypeError("param must be an object");
            for (const type in mimetypes)
                _mimetypes[type] = mimetypes[type];
        }
    };
};