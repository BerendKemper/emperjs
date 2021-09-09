"use strict";
function parseUrlSearchParams(value, key, parent) {
    const type = typeof parent.parsed[key];
    if (type === "undefined")
        parent.parsed[key] = value;
    else if (type === "object")
        parent.parsed[key].push(value);
    else parent.parsed[key] = [parent.parsed[key], value];
}
function parseQueryString(queryString) {
    const urlSearchParams = new URLSearchParams(queryString);
    urlSearchParams.parsed = {};
    urlSearchParams.forEach(parseUrlSearchParams);
    return urlSearchParams.parsed;
}
class RequestBodyParser {
    #parse;
    #errorMessage;
    constructor(parse, errorMessage) {
        this.#parse = parse;
        this.#errorMessage = errorMessage;
    }
    parse(body, request, onParsed) {
        let parsed;
        try {
            parsed = this.#parse(body);
        } catch (error) {
            return request.socket._httpMessage.sendError(400, this.#errorMessage ? new Error(`${this.#errorMessage} "${body}" ${typeof body}`) : error);
        }
        onParsed.call(request, parsed);
    }
}
class RequestBodyParsers {
    constructor() {
        this.add("application/json", JSON.parse, "Body was not in JSON format")
            .add("application/x-www-form-urlencoded", parseQueryString, "Body was not in querystring format");
    }
    /**@param {string} mimetype @param {bodyParser} parse @param {string} errorMessage*/
    add(mimetype, parse, errorMessage) {
        this[mimetype] = new RequestBodyParser(parse, errorMessage);
        return this;
    }
}
module.exports = RequestBodyParsers;
/**@callback bodyParser @param {string} body @return {object}*/