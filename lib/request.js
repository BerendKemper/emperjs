"use strict";
const RequestBodyParsers = require("./bodyParser");
const bodyParsers = new RequestBodyParsers();
module.exports = context => {
    const { logger, routes } = context;
    return class Request extends require("http").IncomingMessage {
        #listener() {
            this.body = [];
            this.params = {};
            this.on("data", this.#onData).on("end", this.#onEnd);
            if (logger)
                logger.log(this.method, "url: " + this.url);
        }
        #onData(chunk) {
            this.body.push(chunk);
        }
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
        }
        #onParsedBody(parsed) {
            this.body = parsed;
            routes.walk(this);
        }
        static get bodyParsers() {
            return bodyParsers;
        }
        static listener = () => {
            delete (this.listener);
            return function (request) {
                request.#listener();
            };
        }
    };
};