"use strict";
const RequestBodyParsers = require("./bodyParser");
const bodyParsers = new RequestBodyParsers();
module.exports = emper => {
    const { logger, routes } = emper;
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
            [this.urlPath, this.urlSearchParams = null] = this.url.split("?");
            if (this.urlSearchParams)
                this.urlSearchParams = new URLSearchParams(this.urlSearchParams);
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
            routes.findEndpoint(this);
        }
        static get bodyParsers() {
            return bodyParsers;
        }
        static {
            emper.requestListener = function (request, respnse) {
                request.#listener();
            };
        }
    };
};