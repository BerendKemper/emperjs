"use strict";
const querystring = require('querystring');
class RequestBodyParser {
    #parse;
    #errorMessage;
    constructor(parse, errorMessage) {
        this.#parse = parse;
        this.#errorMessage = errorMessage;
    };
    parse(body, request, onParsed) {
        let parsed;
        try {
            parsed = this.#parse(body);
        } catch (error) {
            return request.socket._httpMessage.sendError(400, this.#errorMessage ? new Error(`${this.#errorMessage} "${body}" ${typeof body}`) : error);
        };
        onParsed.call(request, parsed);
    };
};
class RequestBodyParsers {
    constructor() {
        this.add("application/json", JSON.parse, "Body was not in JSON format");
        this.add("application/x-www-form-urlencoded", querystring.parse, "Body was not in querystring format");
    };
    /**@param {string} mimetype @param {bodyParser} parse @param {string} errorMessage*/
    add(mimetype, parse, errorMessage) {
        this[mimetype] = new RequestBodyParser(parse, errorMessage);
    };
};
module.exports = RequestBodyParsers;
/**@callback bodyParser @param {string} body @return {object}*/