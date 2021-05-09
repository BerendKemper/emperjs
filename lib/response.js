"use strict";
const { FileStreamer, MultiStreamableFile } = require("./fileStreamer");
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
		if (!Buffer.isBuffer(data)) data = Buffer.from(data);
		this.report(data.byteLength).end(data);
	};
	/**
	 *
	 * @param {Number} byteLength
	 */
	report(byteLength) {
		this.#record.counter++;
		this.#record.bytes += byteLength;
		return this;
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
	#fileStreamer = null;
	/**
	 *
	 * @param {String} filepath
	 * @param {Boolean} end
	 */
	sendFile(filepath, end) {
		if (this.#fileStreamer === null) this.#fileStreamer = new MultiStreamableFile(this);
		this.#fileStreamer.send(filepath, end === false ? false : true);
		return this;
	};
	end(chunk, callback) {
		super.end(chunk, callback);
		this.#fileStreamer = null;
		this.#record = null;
	};
	#record = null;
	get apiRecord() {
		return this.#record;
	};
	set apiRecord(record) {
		if (this.#record) throw new Error("A response's record can only be set once");
		this.#record = record;
	};
};
module.exports = Response;
