"use strict";
const http = require("http");
const https = require("https");
const Routes = require("./routes");
const _package = require("../package,json");
const { serverKey, checkPermission } = require("./accessKeys");
class HttpServer extends http.Server {
	#protocol = "http";
	#routes = new Routes();
	initialise(key) {
		checkPermission(key, serverKey);
		this.on("request", this.#onRequest);
		this.on("connection", this.#onConnection);
	};
	onListening(key, listeningListener) {
		checkPermission(key, serverKey);
		this.on("listening", listeningListener || this.#onListening);
	};
	#onRequest(request, response) {
		request.on("data", request.onData);
		request.on("end", request.onEnd);
		this.#log(request.method, "url: " + request.url);
		response.on("close", () => this.log("CLOSED", "url: " + request.url));
	};
	#onConnection(socket) {
		const remoteUrl = socket.remoteAddress + ":" + socket.remotePort;
		console.log("remote url:", remoteUrl);
		// console.log(socket);
		// console.time("remote url: " + remoteUrl);
		// socket.on("close", () => console.timeEnd("remote url: " + remoteUrl));
	};
	#onListening() {
		// this.#log(`${_package.name} webserver powered by ${_package.distributor}`);
		this.#log(`Listening on: ${this.url}`);
	};
	#log;
	get log() {
		return this.#log;
	};
	set log(log) {
		if (this.#log)
			throw new Error("Readable property is only once settable");
		this.#log = log;
	};
	#error;
	get error() {
		return this.#error;
	};
	set error(log) {
		if (this.#error)
			throw new Error("Readable property is only once settable");
		this.#error = log;
	};
	get routes() {
		return this.#routes;
	};
	get url() {
		const address = this.address()
		return this.#protocol + "://" + address.address + ":" + address.port;
	};
};
class HttpsServer extends https.Server {
	#protocol = "https";
	#routes = new Routes();
	initialise(key) {
		checkPermission(key, serverKey);
		this.on("request", this.#onRequest);
		this.on("connection", this.#onConnection);
	};
	onListening(key, listeningListener) {
		checkPermission(key, serverKey);
		this.on("listening", listeningListener || this.#onListening);
	};
	#onRequest(request, response) {
		request.on("data", request.onData);
		request.on("end", request.onEnd);
		this.#log(request.method, "url: " + request.url);
		response.on("close", () => this.log("CLOSED", "url: " + request.url));
	};
	#onConnection(socket) {
		const remoteUrl = socket.remoteAddress + ":" + socket.remotePort;
		console.log("remote url:", remoteUrl);
		// console.log(socket);
		// console.time("remote url: " + remoteUrl);
		// socket.on("close", () => console.timeEnd("remote url: " + remoteUrl));
	};
	#onListening() {
		// this.#log(`${_package.name} webserver powered by ${_package.distributor}`);
		this.#log(`Listening on: ${this.url}`);
	};
	#log;
	get log() {
		return this.#log;
	};
	set log(log) {
		if (this.#log)
			throw new Error("Readable property is only once settable");
		this.#log = log;
	};
	#error;
	get error() {
		return this.#error;
	};
	set error(log) {
		if (this.#error)
			throw new Error("Readable property is only once settable");
		this.#error = log;
	};
	get routes() {
		return this.#routes;
	};
	get url() {
		const address = this.address()
		return this.#protocol + "://" + address.address + ":" + address.port;
	};
};
module.exports = { HttpServer, HttpsServer };