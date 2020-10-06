"use strict";
const url = require("url");
const http = require("http");
const DataParsers = require("./dataParser");
function Request(socket) {
	http.IncomingMessage.call(this, socket);
	this.$data = [];
};
Object.setPrototypeOf(Request.prototype, http.IncomingMessage.prototype);
Request.prototype.dataParsers = new DataParsers();
Request.prototype.onData = function (chunk) {
	this.$data.push(chunk);
};
Request.prototype.onEnd = function () {
	this.parsedUrl = url.parse(this.url);
	if (this.$data.length > 0)
		if (this.dataParsers[this.headers['content-type']])
			this.dataParsers[this.headers['content-type']].parse(Buffer.concat(this.$data).toString(), this);
		else
			this.onError(new Error(`Failed to identify content-type: ${this.headers['content-type']}`));
	else {
		this.$data = {};
		this.socket._httpMessage.bye(" no data");
	}
};
Request.prototype.onParsedData = function (parsed) {
	this.$data = parsed;
	this.socket._httpMessage.bye(` data: ${JSON.stringify(parsed)}`);
};
Request.prototype.onError = function (error) {
	this.socket._httpMessage.bye(` error: ${error.message}`);
};
Request.prototype.route = function () {
	this.socket.server.routes
};
module.exports = Request;