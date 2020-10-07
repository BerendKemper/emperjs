"use strict";
const http = require("http");
function Response(request) {
	http.ServerResponse.call(this, request);
};
Object.setPrototypeOf(Response.prototype, http.ServerResponse.prototype);
Response.prototype.bye = function (param) {
	this.socket.server.log(param);
	this.end("bye bye monkey" + param);
};
Response.prototype.onError = function (statusCode, error) {
	this.socket.server.error(error);
	const buffer = Buffer.from(error.message);
	this.writeHead(statusCode, {
		'Content-Type': 'text/plain'
	});
	this.end(buffer);
};
module.exports = Response;