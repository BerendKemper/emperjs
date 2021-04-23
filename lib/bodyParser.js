"use strict";
const querystring = require('querystring');
class RequestBodyParser {
	#parse;
	#errorMessage;
	constructor(parse, errorMessage) {
		this.#parse = parse;
		this.#errorMessage = errorMessage;
	};
	parse(body, request) {
		let parsed;
		try {
			parsed = this.#parse(body);
		} catch (error) {
			return request.socket._httpMessage.sendError(400, this.#errorMessage ? new Error(`${this.#errorMessage} "${body}" ${typeof body}`) : error);
		};
		request.onParsedBody(parsed);
	};
};
class RequestBodyParsers {
	constructor() {
		this.add("application/json", JSON.parse, "Body was not in JSON format");
		this.add("application/x-www-form-urlencoded", querystring.parse, "Body was not in querystring format");
	};
	/**
	 * @param {String} mimetype 
	 * @param {Function} parse 
	 * @param {String} errorMessage
	 **/
	add(mimetype, parse, errorMessage) {
		this[mimetype] = new RequestBodyParser(parse, errorMessage);
	};
};
module.exports = RequestBodyParsers;