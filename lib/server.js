"use strict";
const Routes = require("./routes");
const logger = require("./logger");
const _package = require("../package.json");
class HttpServer extends require("http").Server {
	#protocol = "http";
	#initialized = false;
	initialize() {
		if (this.#initialized)
			throw new Error("Webserver may only initialize once");
		this.on("request", this.#onRequest);
		// this.on("connection", this.#onConnection);
	};
	listen(port = 8080, hostname = "127.0.0.1", listeningListener) {
		super.listen(port, hostname, null, listeningListener || this.#onListening)
	};
	#onRequest(request, response) {
		request.on("data", request.onData);
		request.on("end", request.onEnd);
		logger.log(request.method, "url: " + request.url);
		response.on("close", () => logger.log("CLOSED", "url: " + request.url));
	};
	#onConnection(socket) {
		const remoteUrl = socket.remoteAddress + ":" + socket.remotePort;
		console.log("remote url:", remoteUrl);
		// console.log(socket);
		// console.time("remote url: " + remoteUrl);
		// socket.on("close", () => console.timeEnd("remote url: " + remoteUrl));
	};
	#onListening() {
		// logger.log(`Webserver powered by ${_package.name}`);
		logger.log(`Listening on: ${this.url}`);
	};
	#routes = new Routes();
	get routes() {
		return this.#routes;
	};
	get url() {
		const address = this.address()
		return this.#protocol + "://" + address.address + ":" + address.port;
	};
};
class HttpsServer extends require("https").Server {
	#protocol = "https";
	#initialized = false;
	initialize() {
		if (this.#initialized)
			throw new Error("Webserver may only initialize once");
		this.on("request", this.#onRequest);
		// this.on("connection", this.#onConnection);
	};
	listen(port = 8080, hostname = "127.0.0.1", listeningListener) {
		super.listen(port, hostname, null, listeningListener || this.#onListening)
	};
	#onRequest(request, response) {
		request.on("data", request.onData);
		request.on("end", request.onEnd);
		logger.log(request.method, "url: " + request.url);
		response.on("close", () => logger.log("CLOSED", "url: " + request.url));
	};
	#onConnection(socket) {
		const remoteUrl = socket.remoteAddress + ":" + socket.remotePort;
		console.log("remote url:", remoteUrl);
		// console.log(socket);
		// console.time("remote url: " + remoteUrl);
		// socket.on("close", () => console.timeEnd("remote url: " + remoteUrl));
	};
	#onListening() {
		// logger.log(`Webserver powered by ${_package.name}`);
		logger.log(`Listening on: ${this.url}`);
	};
	#routes = new Routes();
	get routes() {
		return this.#routes;
	};
	get url() {
		const address = this.address()
		return this.#protocol + "://" + address.address + ":" + address.port;
	};
};
module.exports = { HttpServer, HttpsServer };