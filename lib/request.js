"use strict";
const url = require("url");
const http = require("http");
function Request(socket) {
	http.IncomingMessage.call(this, socket);
	this.$data = [];
};
Object.setPrototypeOf(Request, http.IncomingMessage);
Object.setPrototypeOf(Request.prototype, http.IncomingMessage.prototype);
Request.prototype.onData = function (chunk) {
	this.$data.push(chunk);
};
Request.prototype.onEnd = function () {
	const [path, searchParams] = this.url.split("?");
	this.urlPathname = path;
	if (searchParams)
		this.urlSearchParams = new URLSearchParams(searchParams);
	if (this.$data.length > 0)
		if (this.dataParsers[this.headers['content-type']])
			this.dataParsers[this.headers['content-type']].parse(Buffer.concat(this.$data).toString(), this);
		else
			this.onError(400, new Error(`Failed to identify content-type: ${this.headers['content-type']}`));
	else {
		this.$data = {};
		this.socket.server.routes.walk(this);
	}
};
Request.prototype.onParsedData = function (parsed) {
	this.$data = parsed;
	this.socket.server.routes.walk(this);
};
module.exports = Request;