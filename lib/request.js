"use strict";
const RequestBodyParsers = require("./bodyParser");
const { URLSearchParams } = require("url");
const logger = require("./logger");
class Request extends require("http").IncomingMessage {
	body = [];
	constructor(socket) {
		super(socket);
		this.on("data", this.#onData);
		this.on("end", this.#onEnd);
		this.on("close", this.#onClose);
	};
	#onData(chunk) {
		this.body.push(chunk);
	};
	#onEnd() {
		const [path, searchParams] = this.url.split("?");
		this.urlPathname = path;
		if (searchParams) this.urlSearchParams = new URLSearchParams(searchParams);
		if (this.body.length > 0) {
			const parser = Request.#bodyParsers[this.headers["content-type"]];
			return parser
				? parser.parse(Buffer.concat(this.body).toString(), this, this.#onParsedBody)
				: this.socket._httpMessage.sendError(400, new Error(`Failed to identify content-type: ${this.headers["content-type"]}`));
		}
		this.#onParsedBody({});
	};
	#onParsedBody(parsed) {
		this.body = parsed;
		this.socket.server.routes.walk(this);
	};
	#onClose() {
		logger.log("CLOSED", "url: " + this.url);
	};
	static #bodyParsers = new RequestBodyParsers();
	static get bodyParsers() {
		return Request.#bodyParsers;
	};
	static set bodyParsers(bodyParsers) {
		if (Request.#bodyParsers) throw new Error("Request dataParsers can only be set once");
		Request.#bodyParsers = bodyParsers;
	};
};
module.exports = Request;