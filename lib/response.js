"use strict";
const http = require("http");
function Response(request) {
	http.ServerResponse.call(this, request);
};
Object.setPrototypeOf(Response.prototype, http.ServerResponse.prototype);
Response.prototype.bye = function (param) {
	this.socket.server.error(param);
	this.end("bye bye monkey" + param);
};
Response.prototype.onError = function (error) {
	this.socket.server.error(error);
	this.end("bye bye monkey" + error);
};
module.exports = Response;