"use strict";
const FileStream = require("./fileStream");
module.exports = context => {
    const { logger } = context;
    return class Response extends require("http").ServerResponse {
        #fileStreamer = null;
        #record = null;
        constructor(request) {
            super(request);
            this.url = request.url;
            if (logger)
                this.on("close", this.#onClose);
        }
        sendJson(status, data) {
            data = Buffer.from(JSON.stringify(data));
            this.report(byteLength).writeHead(status, {
                'Content-Type': 'application/json'
            }).end(data);
        }
        send(data) {
            if (!Buffer.isBuffer(data))
                data = Buffer.from(data);
            this.report(byteLength).end(data);
        }
        report(byteLength) {
            if (this.#record) {
                this.#record.counter++;
                this.#record.bytes += byteLength;
            }
            return this;
        }
        sendError(status, error) {
            logger ? logger.error(error.stack) : console.error(error.stack);
            this.writeHead(status, { 'Content-Type': 'text/plain' }).end(Buffer.from(error.message));
        }
        sendFile(filepath) {
            return (this.#fileStreamer ? this.#fileStreamer : this.#fileStreamer = new FileStream(this)).send(filepath);
        }
        #onClose() {
            logger.log("CLOSED", "url: " + this.url)
            this.#fileStreamer = null;
            this.#record = null;
        }
        get apiRecord() {
            return this.#record;
        }
        set apiRecord(record) {
            if (this.#record)
                throw new Error("A response's record can only be set once");
            this.#record = record;
        }
    }
}