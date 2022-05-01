"use strict";
const RequestBodyParsersFactory = require("./bodyParser");
module.exports = emper => {
    const RequestBodyParsers = RequestBodyParsersFactory(emper);
    const bodyParsers = new RequestBodyParsers();
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
                    : emper.requestErrorHandle(this, 400, new Error(`Failed to identify content-type: ${this.headers["content-type"]}`));
            }
            this.#onParsedBody(this, {});
        }
        #onParsedBody(request, parsed) {
            request.body = parsed;
            const context = routes.findEndpoint(request);
            if (context.found)
                emper.handleEndpoint(request, request.#response, context.route);
            else if (context.faultyRoute.distance < context.targets.length)
                request.#response.sendError(400, new Error(`Could not identify "/${context.fault}" in "${request.urlPath}"`));
            else
                request.#response.sendError(405, new Error(`Method ${request.method} not allowed in the endpoint "${request.urlPath}"`));
            request.#response = null;
        }
        static get bodyParsers() {
            return bodyParsers;
        }
        static {
            emper.requestListener = function emper_requestListener(request, response) {
                request.#response = response;
                request.#listener();
            };
            emper.requestErrorHandle = function (request, statusCode, error) {
                request.#response.sendError(statusCode, error);
                request.#response = null;
            };
        }
    };
};