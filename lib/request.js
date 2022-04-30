"use strict";
const RequestBodyParsers = require("./bodyParser");
const bodyParsers = new RequestBodyParsers();
module.exports = emper => {
    const { logger, routes } = emper;
    return class Request extends require("http").IncomingMessage {
        #response = null;
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
            const context = routes.findEndpoint(this);
            if (context.found)
                emper.handleEndpoint(this, this.#response, context.route);
            else if (context.faultyRoute.distance < context.targets.length)
                response.sendError(400, new Error(`Could not identify "/${context.fault}" in "${this.urlPath}"`));
            else
                response.sendError(405, new Error(`Method ${this.method} not allowed in the endpoint "${context.faultyRoute.fullpath}"`));
            this.#response = null;
        }
        static get bodyParsers() {
            return bodyParsers;
        }
        static {
            emper.requestListener = function emper_requestListener(request, response) {
                request.#response = response;
                request.#listener();
            };
        }
    };
};