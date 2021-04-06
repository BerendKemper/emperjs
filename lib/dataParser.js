"use strict";
const querystring = require('querystring');
class RequestDataParser {
	#parse;
	#errorMessage;
	constructor(parse, errorMessage) {
		this.#parse = parse;
		this.#errorMessage = errorMessage;
	};
	parse(data, request) {
		let parsed;
		try {
			parsed = this.#parse(data);
		} catch (error) {
			return request.socket._httpMessage.sendError(400, this.#errorMessage ? new Error(`${this.#errorMessage} "${data}" ${typeof data}`) : error);
		};
		request.onParsedData(parsed);
	};
};
class RequestDataParsers {
	constructor() {
		this.add("application/json", JSON.parse, "Data was not in JSON format");
		this.add("application/x-www-form-urlencoded", querystring.parse, "Data was not in querystring format");
	};
	/**
	 * @param {String} mimetype 
	 * @param {Function} parse 
	 * @param {String} errorMessage
	 **/
	add(mimetype, parse, errorMessage) {
		this[mimetype] = new RequestDataParser(parse, errorMessage);
	};
};
module.exports = RequestDataParsers;