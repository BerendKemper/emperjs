"use strict";
const http = require("http");
const https = require("https");
const Routes = require("./routes");
function HttpServer(options, requestListener) {
	http.Server.call(this, options, requestListener);
	this.protocol = "http";
};
Object.setPrototypeOf(HttpServer.prototype, http.Server.prototype);
function HttpsServer(options, requestListener) {
	https.Server.call(this, options, requestListener);
	this.protocol = "https";
};
Object.setPrototypeOf(HttpsServer.prototype, https.Server.prototype);
HttpServer.prototype.initialise = HttpsServer.prototype.initialise = function initialise() {
	this.on("request", this.onRequest);
	this.on("connection", this.onConnection);
	this.routes = new Routes(this);
};
HttpServer.prototype.onRequest = HttpsServer.prototype.onRequest = function onRequest(request, response) {
	request.on("data", request.onData);
	request.on("end", request.onEnd);
	request.onRoute = () => request.api(request, response);
	request.onError = error => response.onError(error);
	this.log(request.method, "url: " + request.url);
	response.on("close", () => this.log("CLOSED", "url: " + request.url));
};
HttpServer.prototype.onConnection = HttpsServer.prototype.onConnection = function onConnection(socket) {
	socket.on("data", this.onConnectionData)
};
HttpServer.prototype.onConnectionData = HttpsServer.prototype.onConnectionData = function onConnectionData(chunk) {
	// console.log(chunk.toString("utf8"));
};
HttpServer.prototype.$listen = HttpsServer.prototype.$listen = function $listen(port, hostname, backlog, listeningListener = this.onListening) {
	this.listen(port, hostname, backlog, listeningListener);
};
HttpServer.prototype.onListening = HttpsServer.prototype.onListening = function onListening() {
	const address = this.address();
	this.url = this.protocol + "://" + address.address + ":" + address.port;
	console.log("listening on:", this.url);
};
module.exports = { HttpServer, HttpsServer };