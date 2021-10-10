"use strict";
const MultiStreamableFile = require("./fileStreamer");
module.exports = context => {
    const { logger } = context;
    return class Response extends require("http").ServerResponse {
        #fileStreamer = null;
        #record = null;
        constructor(request) {
            super(request);
            this.on("close", this.#onClose);
        }
        sendJson(status, data) {
            this.writeHead(status, { 'Content-Type': 'application/json' });
            data = Buffer.from(JSON.stringify(data));
            this.#record.counter++;
            this.#record.bytes += data.byteLength;
            this.end(data);
        }
        send(data) {
            if (!Buffer.isBuffer(data)) data = Buffer.from(data);
            this.#record.counter++;
            this.#record.bytes += data.byteLength;
            this.end(data);
        }
        report(byteLength) {
            this.#record.counter++;
            this.#record.bytes += byteLength;
            return this;
        }
        sendError(status, error) {
            logger ? logger.error(error.stack) : console.error(error.stack);
            const buffer = Buffer.from(error.message);
            this.writeHead(status, { 'Content-Type': 'text/plain' });
            this.end(buffer);
        }
        sendFile(filepath, end = true) {
            if (this.#fileStreamer === null) this.#fileStreamer = new MultiStreamableFile(this);
            this.#fileStreamer.send(filepath, end === false ? false : true);
            return this;
        }
        #onClose() {
            this.#fileStreamer = null;
            this.#record = null;
        }
        get apiRecord() {
            return this.#record;
        }
        set apiRecord(record) {
            if (this.#record) throw new Error("A response's record can only be set once");
            this.#record = record;
        }
    }
}