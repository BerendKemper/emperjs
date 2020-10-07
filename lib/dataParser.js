"use strict";
const querystring = require('querystring');
function DataParser(parser, errorMessage) {
	this.parser = parser;
	this.errorMessage = errorMessage;
};
DataParser.prototype.parse = function parse(data, request) {
	try {
		request.onParsedData(this.parser(data));
	} catch (error) {
		request.onError(400, this.errorMessage ? new Error(this.errorMessage + `: "${data}"`) : error);
	};
};
function RequestDataParsers() {
	this.set("application/json", JSON.parse, "Data was not in JSON format");
	this.set("application/x-www-form-urlencoded", querystring.parse, "Data was not in querystring format");
};
/**
 * 
 * @param {String} mimetype 
 * @param {Function} parse 
 * @param {String} errorMessage 
 */
RequestDataParsers.prototype.set = function set(mimetype, parse, errorMessage) {
	this[mimetype] = new DataParser(parse, errorMessage);
};
module.exports = RequestDataParsers;