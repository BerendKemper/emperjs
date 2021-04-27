"use strict";
const FileTransfer = require("./fileTransfer");
const logger = require("./logger");
class Response extends require("http").ServerResponse {
	sendJson(status, data) {
		this.writeHead(status, {
			'Content-Type': 'application/json'
		});
		this.send(JSON.stringify(data));
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
		this.#record.counter++;
		this.#record.bytes += byteLength;
	};
	/**
	 * @param {Number} statusCode 
	 * @param {Error} error
	 **/
	sendError(status, error) {
		logger.error(error.stack);
		const buffer = Buffer.from(error.message);
		this.writeHead(status, {
			'Content-Type': 'text/plain'
		});
		this.end(buffer);
	};
	#fileTransfer = null;
	/**
	 * 
	 * @param {String} filepath
	 * @param {Boolean} end
	 */
	sendFile(filepath, end) {
		if (this.#fileTransfer === null)
			this.#fileTransfer = new FileTransfer(this);
		this.#fileTransfer.send(filepath, end === false ? false : true);
		return this;
	};
	#record = null;
	get apiRecord() {
		return this.#record;
	};
	set apiRecord(record) {
		if (!this.#record)
			this.#record = record;
	};
};
module.exports = Response;
