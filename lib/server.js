"use strict";
const Routes = require("./routes");
const logger = require("./logger");
// const MemoryTime = require("memory-time");
class HttpServer extends require("http").Server {
	#protocol = "http";
	#initialized = false;
	#memory = null;
	initialize() {
		if (this.#initialized) throw new Error("Webserver may only initialize once");
		this.on("request", this.#onRequest);
		// this.on("connection", this.#onConnection);
	};
	#onRequest(request, response) {
		request.on("data", request.onData);
		request.on("end", request.onEnd);
		logger.log(request.method, "url: " + request.url);
		// if (!this.#memory)
		// 	this.#memory = new MemoryTime("./single-LargeSingle.csv");
		response.on("close", () => {
			// this.#memory.measure()
			logger.log("CLOSED", "url: " + request.url);
		});
	};
	#onConnection(socket) {
		const remoteUrl = socket.remoteAddress + ":" + socket.remotePort;
		console.log("remote url:", remoteUrl);
		// console.log(socket);
		// console.time("remote url: " + remoteUrl);
		// socket.on("close", () => console.timeEnd("remote url: " + remoteUrl));
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
		if (this.#initialized) throw new Error("Webserver may only initialize once");
		this.on("request", this.#onRequest);
	};
	#onRequest(request, response) {
		request.on("data", request.onData);
		request.on("end", request.onEnd);
		logger.log(request.method, "url: " + request.url);
		response.on("close", () => logger.log("CLOSED", "url: " + request.url));
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