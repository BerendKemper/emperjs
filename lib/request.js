"use strict";
const RequestDataParsers = require("./dataParser");
const { URLSearchParams } = require("url");
class Request extends require("http").IncomingMessage {
	data = [];
	onData(chunk) {
		this.data.push(chunk);
	};
	onEnd() {
		const [path, searchParams] = this.url.split("?");
		this.urlPathname = path;
		if (searchParams)
			this.urlSearchParams = new URLSearchParams(searchParams);
		if (this.data.length > 0) {
			const parser = Request.#dataParsers[this.headers["content-type"]];
			return parser ? parser.parse(Buffer.concat(this.data).toString(), this) : this.socket._httpMessage.sendError(400, new Error(`Failed to identify content-type: ${this.headers["content-type"]}`));
		}
		this.onParsedData({});
	};
	onParsedData(parsed) {
		this.data = parsed;
		this.socket.server.routes.walk(this);
	};
	static #dataParsers = new RequestDataParsers();
	static get dataParsers() {
		return Request.#dataParsers;
	};
	static set dataParsers(dataParsers) {
		if (Request.#dataParsers)
			throw new Error("Request dataParsers can only be set once");
		Request.#dataParsers = dataParsers;
	};
};
module.exports = Request;