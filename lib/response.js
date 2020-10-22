"use strict";
const http = require("http");
function Response(request) {
	http.ServerResponse.call(this, request);
};
Object.setPrototypeOf(Response, http.ServerResponse);
Object.setPrototypeOf(Response.prototype, http.ServerResponse.prototype);
/**@param {String|Buffer} data
 * @param {String} encoding */
Response.prototype.send = function send(data, encoding) {
	if (!Buffer.isBuffer(data))
		data = Buffer.from(data);
	this.stats.counter++;
	this.stats.bytes += data.byteLength;
	this.end(data);
};
/**@param {Number} statusCode 
 * @param {Error} error */
Response.prototype.onError = function onError(statusCode, error) {
	this.socket.server.error(error);
	const buffer = Buffer.from(error.message);
	this.writeHead(statusCode, {
		'Content-Type': 'text/plain'
	});
	this.end(buffer);
};
module.exports = Response;