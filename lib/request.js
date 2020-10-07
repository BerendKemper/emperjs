"use strict";
const url = require("url");
const http = require("http");
function Request(socket) {
	http.IncomingMessage.call(this, socket);
	this.$data = [];
};
Object.setPrototypeOf(Request.prototype, http.IncomingMessage.prototype);
Request.prototype.onData = function (chunk) {
	this.$data.push(chunk);
};
Request.prototype.onEnd = function () {
	this.parsedUrl = url.parse(this.url);
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
Request.prototype.onError = function (statusCode, error) {
	this.socket._httpMessage.onError(statusCode, error);
};
module.exports = Request;