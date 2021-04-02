"use strict";
const url = require("url");
const http = require("http");
class Request extends http.IncomingMessage {
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
			const parser = Request.#dataParsers[this.headers['content-type']];
			return parser ? parser.parse(Buffer.concat(this.data).toString(), this) : this.socket._httpMessage.sendError(400, new Error(`Failed to identify content-type: ${this.headers['content-type']}`));
		}
		this.onParsedData({});
	};
	onParsedData(parsed) {
		this.data = parsed;
		this.socket.server.routes.walk(this);
	};
	static #dataParsers;
	static set dataParsers(dataParsers) {
		return Request.#dataParsers = dataParsers;
	};
};
module.exports = Request;