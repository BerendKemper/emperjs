"use strict";
const http = require("http");
class Response extends http.ServerResponse {
	/**
	 * @param {String|Buffer} data
	 **/
	send(data) {
		if (!Buffer.isBuffer(data))
			data = Buffer.from(data);
		this.end(data);
		this.report.counter++;
		this.report.bytes += data.byteLength;
	};
	/**
	 * @param {Number} statusCode 
	 * @param {Error} error
	 **/
	sendError(statusCode, error) {
		this.socket.server.error(error);
		console.log(error);
		const buffer = Buffer.from(error.message);
		this.writeHead(statusCode, {
			'Content-Type': 'text/plain'
		});
		this.end(buffer);
	};
};
module.exports = Response;