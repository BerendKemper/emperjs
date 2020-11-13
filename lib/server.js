"use strict";
const http = require("http");
const https = require("https");
const Routes = require("./routes");
const config = require("../config.json");
function HttpServer(options, requestListener) {
	http.Server.call(this, options, requestListener);
	this.protocol = "http";
};
Object.setPrototypeOf(HttpServer, http.Server);
Object.setPrototypeOf(HttpServer.prototype, http.Server.prototype);
function HttpsServer(options, requestListener) {
	https.Server.call(this, options, requestListener);
	this.protocol = "https";
};
Object.setPrototypeOf(HttpsServer, https.Server);
Object.setPrototypeOf(HttpsServer.prototype, https.Server.prototype);
HttpServer.prototype.initialise = HttpsServer.prototype.initialise = function initialise() {
	this.on("request", this.onRequest);
	this.on("connection", this.onConnection);
	this.routes = new Routes();
};
HttpServer.prototype.onRequest = HttpsServer.prototype.onRequest = function onRequest(request, response) {
	request.on("data", request.onData);
	request.on("end", request.onEnd);
	this.log(request.method, "url: " + request.url);
	response.on("close", () => this.log("CLOSED", "url: " + request.url));
};
HttpServer.prototype.onConnection = HttpsServer.prototype.onConnection = function onConnection(socket) {
	/* socket.on("data", this.onConnectionData); */
	const address = socket.remoteAddress + ":" + socket.remotePort
	console.time("address: " + address);
	socket.on("close", () => console.timeEnd("address: " + address));
};
HttpServer.prototype.onConnectionData = HttpsServer.prototype.onConnectionData = function onConnectionData(chunk) {
	/* console.log(chunk.toString("utf8")); */
};
HttpServer.prototype.onListening = HttpsServer.prototype.onListening = function onListening() {
	const address = this.address();
	this.url = this.protocol + "://" + address.address + ":" + address.port;
	console.log(`Powered by ${config.name}`);
	console.log(`Listening on: ${this.url}`);
};
module.exports = { HttpServer, HttpsServer };