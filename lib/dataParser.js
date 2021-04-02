"use strict";
const querystring = require('querystring');
class DataParser {
	#parse;
	#errorMessage;
	constructor(parse, errorMessage) {
		this.#parse = parse;
		this.#errorMessage = errorMessage;
	};
	parse(data, request) {
		try {
			request.onParsedData(this.#parse(data));
		} catch (error) {
			request.socket._httpMessage.onError(400, this.#errorMessage ? new Error(`${this.#errorMessage} "${data}"`) : error);
		};
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
		this[mimetype] = new DataParser(parse, errorMessage);
	};
};
module.exports = RequestDataParsers;