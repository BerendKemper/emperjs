"use strict";
function parseUrlSearchParams(body, value, key) {
    const type = typeof body[key];
    if (type === "undefined")
        body[key] = value;
    else if (type === "object")
        body[key].push(value);
    else body[key] = [body[key], value];
    return body;
}
function parseQueryString(queryString) {
    const urlSearchParams = new URLSearchParams(queryString);
    return Array.prototype.reduce.call(urlSearchParams, parseUrlSearchParams, {});
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
            return request.socket._httpMessage.sendError(400, this.#errorMessage
                ? new Error(`${this.#errorMessage} "${body}" ${typeof body}`)
                : error);
        }
        onParsed.call(request, parsed);
    }
}
class RequestBodyParsers {
    constructor() {
        this.add("application/json", JSON.parse, "Body was not in JSON format")
            .add("application/x-www-form-urlencoded", parseQueryString, "Body was not in querystring format");
    }
    add(mimetype, parse, errorMessage) {
        this[mimetype] = new RequestBodyParser(parse, errorMessage);
        return this;
    }
}
module.exports = RequestBodyParsers;