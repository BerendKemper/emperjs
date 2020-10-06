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
		request.onError(this.errorMessage ? new Error(this.errorMessage) : error);
	};
};
function DataParsers() {
	this.set("application/json", JSON.parse, "Data was not in JSON format");
	this.set("application/x-www-form-urlencoded", querystring.parse, "Data was not in querystring format");
};
DataParsers.prototype.set = function set(mimetype, parse, errorMessage) {
	this[mimetype] = new DataParser(parse, errorMessage);
};
module.exports = DataParsers;