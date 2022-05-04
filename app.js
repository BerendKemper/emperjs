"use strict";
const RequestFactory = require("./lib/request");
const ResponseFactory = require("./lib/response");
const SocketFactory = require("./lib/socket");
const ApiRegisterFactory = require("./lib/apiRegister");
const _mimetypes = require("emperjs/lib/fileTypes");
const httpMethods = require("./lib/httpMethods");
const Logger = require("./lib/logger");
const Routes = require("./lib/routes");
/**@type {import("emperjs/emper").AppFactory}*/
module.exports = (protocol, options) => {
    var http = require("http");
    protocol === "https" && (http = require("https"));
    const logger = options?.logger === false ? null : new Logger();
    const routes = new Routes();
    const emper = { logger, routes };
    const Request = RequestFactory(emper);
    const Response = ResponseFactory(emper);
    let EmperRequest = Request;
    let EmperResponse = Response;
    const Socket = SocketFactory(emper);
    // function onConnection(socket) { };
    /* function onError(error) { }; */
    const ApiRegister = ApiRegisterFactory();
    const apiRegister = new ApiRegister();
    let app = false;
    return class App extends http.Server {
        constructor(options = {}) {
            if (app === (app = true))
                throw new Error("An App can only create one instance");
            if (options === null || typeof options !== "object")
                throw new TypeError("param must be an object");
            options.IncomingMessage = EmperRequest;
            options.ServerResponse = EmperResponse;
            emper.server = super(options, emper.requestListener);
            emper.requestListener = null;
            // this.on("connection", onConnection);
            /* this.on("error", onError); */
            this.on("listening", emper.listeningListener);
            emper.listeningListener = null;
        }
        listen(options = {}, listeningListener) {
            return super.listen({
                port: options?.port || protocol === "https" ? 8081 : 8080,
                host: options?.hostname || options?.host || "127.0.0.1",
                backlog: options?.backlog || null
            }, listeningListener || (() => console.log(`Listening on: ${this.url}`)));
        }
        delete(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.adaddEndpointd(path, "DELETE", callback).record = options?.record === false ? null : apiRegister.register(path, "DELETE");
        }
        get(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addEndpoint(path, "GET", callback).record = options?.record === false ? null : apiRegister.register(path, "GET");
        }
        head(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addEndpoint(path, "HEAD", callback).record = options?.record === false ? null : apiRegister.register(path, "HEAD");
        }
        options(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addEndpoint(path, "OPTIONS", callback).record = options?.record === false ? null : apiRegister.register(path, "OPTIONS");
        }
        patch(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addEndpoint(path, "PATCH", callback).record = options?.record === false ? null : apiRegister.register(path, "PATCH");
        }
        post(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addEndpoint(path, "POST", callback).record = options?.record === false ? null : apiRegister.register(path, "POST");
        }
        put(path, callback, options) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addEndpoint(path, "PUT", callback).record = options?.record === false ? null : apiRegister.register(path, "PUT");
        }
        use(path, callback) {
            if (typeof callback !== "function") throw new TypeError("Callback must be a function");
            routes.addMiddleware(path, callback);
        }
        loadApiRegister(register, reset) {
            if (register === null || typeof register !== "object")
                throw new TypeError("param must be an object");
            const apis = apiRegister.apis;
            const recordCall = reset === true ? "reset" : "from";
            for (const path in apis) {
                const api = apis[path];
                const loadingApi = register[path] !== null && typeof register[path] === "object"
                    ? register[path]
                    : {};
                register[path] = api;
                for (const method in api)
                    if (httpMethods.has(method))
                        api[method][recordCall](loadingApi[method]);
            }
            apiRegister.load(register);
            return this;
        }
        destroyUnusedRecords() {
            const apis = apiRegister.apis;
            for (const path in apis) {
                const api = apis[path];
                for (const method in api)
                    if (!(routes.hasEndpoint(path, method)?.record))
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
            if (OwnIncomingMessage === null)
                return EmperRequest = Request;
            else if (!Object.create(OwnIncomingMessage.prototype) instanceof Request)
                throw TypeError(`The parameter IncomingMessage is not derived from Request`);
            EmperRequest = OwnIncomingMessage;
        }
        static get ServerResponse() {
            return EmperResponse;
        }
        static set ServerResponse(OwnServerResponse) {
            if (OwnServerResponse === null)
                return EmperResponse = Response;
            else if (!Object.create(OwnServerResponse.prototype) instanceof Response)
                throw TypeError(`The parameter ServerResponse is not a child of Response`);
            EmperResponse = OwnServerResponse;
        }
        static get Socket() {
            return Socket.EmperSocket;
        }
        static set Socket(OwnSocket) {
            Socket.EmperSocket = OwnSocket;
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
            if (mimetypes === null || typeof mimetypes !== "object")
                throw new TypeError("param must be an object");
            for (const type in mimetypes)
                _mimetypes[type] = mimetypes[type];
        }
    };
};