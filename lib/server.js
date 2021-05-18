"use strict";
const Routes = require("./routes");
const logger = require("./logger");
// const MemoryTime = require("memory-time");
class HttpServer extends require("http").Server {
	#protocol = "http";
	// #memory = null;
	constructor(options) {
		super(options);
		this.on("request", this.#onRequest);
	};
	#onRequest(request, response) {
		logger.log(request.method, "url: " + request.url);
		// if (this.#memory === null)
		// 	this.#memory = new MemoryTime("./memory-time/logger_fs_api.csv");
		// request.on("close", () => this.#memory.measure());
	};
	#onConnection(socket) {
		const remoteUrl = socket.remoteAddress + ":" + socket.remotePort;
		console.time("remote url: " + remoteUrl);
		socket.on("close", () => console.timeEnd("remote url: " + remoteUrl));
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
		this.on("request", this.#onRequest);
	};
	#onRequest(request, response) {
		logger.log(request.method, "url: " + request.url);
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