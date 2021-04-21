"use strict";
const PipeFile = require("./pipeFile");
const logger = require("./logger");
class Response extends require("http").ServerResponse {
	sendJson(object) {
		this.writeHead(200, {
			'Content-Type': 'application/json'
		});
		this.send(JSON.stringify(object));
	};
	/**
	 * @param {String|Buffer} data
	 **/
	send(data) {
		if (!Buffer.isBuffer(data))
			data = Buffer.from(data);
		this.end(data);
		this.report(data.byteLength);
	};
	/**
	 * 
	 * @param {Number} byteLength 
	 */
	report(byteLength) {
		this.#report.counter++;
		this.#report.bytes += byteLength;
	};
	/**
	 * @param {Number} statusCode 
	 * @param {Error} error
	 **/
	sendError(statusCode, error) {
		logger.error(error.stack);
		const buffer = Buffer.from(error.message);
		this.writeHead(statusCode, {
			'Content-Type': 'text/plain'
		});
		this.end(buffer);
	};
	/**
	 * 
	 * @param {String} filepath
	 * @param {Boolean} end
	 */
	pipeFile(filepath, end) {
		new PipeFile(this, filepath, { end: end === false ? false : true });
	};
	#report;
	get apiReport() {
		return this.#report;
	};
	set apiReport(report) {
		if (!this.#report)
			this.#report = report;
	};
};
module.exports = Response;
