"use strict";
const RequestBodyParsers = require("./bodyParser");
const logger = require("./logger");
const bodyParsers = new RequestBodyParsers();
class Request extends require("http").IncomingMessage {
    /**@type {object}*/
    body = [];
    /**Contains key values identified in the url's path by /:key
     * @type {Object.<string,string>}*/
    params = {};
    constructor(socket) {
        super(socket);
        this.on("data", this.#onData);
        this.on("end", this.#onEnd);
        this.on("close", this.#onClose);
    };
    #onData(chunk) {
        this.body.push(chunk);
    };
    #onEnd() {
        const [path, searchParams] = this.url.split("?");
        this.urlPath = path;
        this.urlSearchParams = searchParams ? new URLSearchParams(searchParams) : null;
        if (this.body.length > 0) {
            const parser = bodyParsers[this.headers["content-type"]];
            return parser
                ? parser.parse(Buffer.concat(this.body).toString(), this, this.#onParsedBody)
                : this.socket._httpMessage.sendError(400, new Error(`Failed to identify content-type: ${this.headers["content-type"]}`));
        }
        this.#onParsedBody({});
    };
    #onParsedBody(parsed) {
        this.body = parsed;
        this.socket.server.routes.walk(this);
    };
    #onClose() {
        logger.log("CLOSED", "url: " + this.url);
    };
    static get bodyParsers() {
        return bodyParsers;
    };
};
module.exports = Request;