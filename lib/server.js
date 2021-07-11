"use strict";
const Routes = require("./routes");
const logger = require("./logger");
const { onconnection } = require("./socket");
function onConnection(socket) { };
function onError(error) { };
function onListening() {
    this._handle.onconnection = onconnection;
};
function onRequest(request, response) {
    logger?.log(request.method, "url: " + request.url);
};
class HttpServer extends require("http").Server {
    #protocol = "http";
    constructor(options) {
        super(options);
        // this.on("connection", onConnection);
        // this.on("error", onError);
        this.once("listening", onListening);
        this.on("request", onRequest);

    };
    #routes = new Routes();
    get routes() {
        return this.#routes;
    };
    get url() {
        const address = this.address();
        return this.#protocol + "://" + address.address + ":" + address.port;
    };
};
class HttpsServer extends require("https").Server {
    #protocol = "https";
    constructor(options) {
        super(options);
        // this.on("connection", onConnection);
        // this.on("error", onError);
        this.once("listening", onListening);
        this.on("request", onRequest);
    };
    #routes = new Routes();
    get routes() {
        return this.#routes;
    };
    get url() {
        const address = this.address();
        return this.#protocol + "://" + address.address + ":" + address.port;
    };
};
module.exports = { HttpServer, HttpsServer };