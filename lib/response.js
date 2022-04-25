"use strict";
const CallbackQueue = require("ca11back-queue");
const FileStream = require("./fileStream");
function queueEndpoint(request, response, next, apiEndpoint) {
    this.clear();
    apiEndpoint(request, response);
}
module.exports = emper => {
    const { logger } = emper;
    return class Response extends require("http").ServerResponse {
        #fileStreamer = null;
        #record = null;
        #queue = null;
        constructor(request) {
            super(request).#queue = new CallbackQueue(request, this);
            this.url = request.url;
            if (logger)
                this.on("close", this.#onClose);
        }
        sendJson(status, data) {
            data = Buffer.from(JSON.stringify(data));
            this.report(data.byteLength).writeHead(status, {
                'Content-Type': 'application/json'
            }).end(data);
        }
        send(data) {
            if (!Buffer.isBuffer(data))
                data = Buffer.from(data);
            this.report(data.byteLength).end(data);
        }
        report(byteLength) {
            if (this.#record) {
                this.#record.counter++;
                this.#record.bytes += byteLength;
            }
            return this;
        }
        sendError(status, error) {
            logger
                ? logger.error(error.stack)
                : console.error(error.stack);
            this.writeHead(status, { 'Content-Type': 'text/plain' }).end(Buffer.from(error.message));
        }
        sendFile(filepath) {
            return (this.#fileStreamer
                ? this.#fileStreamer
                : this.#fileStreamer = new FileStream(this, this.#queue)).send(filepath);
        }
        #onClose() {
            if (logger)
                logger.log("CLOSED", "url: " + this.url);
            this.#queue.destroy();
            this.#queue = null;
            this.#fileStreamer = null;
            this.#record = null;
        }
        get apiRecord() {
            return this.#record;
        }
        static {
            console.log("setting emper.handleEndpoint");
            emper.handleEndpoint = (request, response, route) => {
                for (var path in route) {
                    const routeMiddleware = route[path].middleware;
                    for (const middleware of routeMiddleware)
                        response.#queue.push(middleware);
                }
                const apiEndpoint = route[path].endpoint[request.method];
                if (apiEndpoint.record)
                    response.#record = apiEndpoint.record;
                response.#queue.push(queueEndpoint, apiEndpoint);
            }
        }
    }
}