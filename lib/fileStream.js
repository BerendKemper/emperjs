"use strict";
const { close, open, read, fstat, FSReqCallback } = process.binding('fs');
const { S_IFMT, S_IFREG, O_RDONLY } = require("fs").constants;
const { toNamespacedPath, parse } = require("path");
const mimetypes = require("emperjs/lib/fileTypes");
const nullBuffer = Buffer.allocUnsafe(0);
let highWaterMark = 16384;
let counter = 0;
let streaming = {};
class MultiWritableContext {
    pos = 0;
    size = null;
    streamers = [];
    constructor(file) {
        this.file = file;
    }
    write() {
        let i = this.streamers.length;
        const afterWritten = () => {
            if (--i === 0) {
                if (this.size < highWaterMark)
                    this.buffer = Buffer.allocUnsafe(this.readLength = this.size);
                this.file.readChunk(this);
            }
        };
        for (const streamer of this.streamers)
            streamer.response.write(this.buffer, "utf8", afterWritten);
    }
    end() {
        for (const streamer of this.streamers)
            streamer.end(this.buffer || nullBuffer, this.pos);
        this.buffer = null;
        this.streamers = null;
        this.file = null;
    }
    sendErrors(error) {
        for (const stream of this.streamers) {
            stream.response.sendError(error.status, error);
            stream.destroyStream();
        }
        this.buffer = null;
        this.streamers = null;
        this.file = null;
    }
}
class MultiReadableFile {
    fd = null;
    error = null;
    connections = 1;
    context = new MultiWritableContext(this);
    constructor(filepath, streamer) {
        this.filepath = filepath;
        this.context.streamers.push(streamer);
        const req = new FSReqCallback();
        req.oncomplete = this.#constructAfterOpen;
        req.file = this;
        open(toNamespacedPath(filepath), O_RDONLY, 0o666, req);
        counter++;
    }
    #constructAfterOpen(error, fd) {
        const file = this.file;
        if (file.error = file.error ?? error) {
            if (typeof file.error.status === "undefined")
                file.error.status = 404;
            return file.onError(file.context, file.error);
        }
        file.fd = fd;
        const req = new FSReqCallback();
        req.oncomplete = file.#constructAfterStat;
        req.file = file;
        fstat(fd, false, req);
    }
    #constructAfterStat(error, stats) {
        const file = this.file;
        const context = file.context;
        if (file.error = file.error ?? error) {
            if (typeof file.error.status === "undefined")
                file.error.status = 500;
            return file.onError(context, file.error);
        }
        context.size = file.size = (stats[1] & S_IFMT) === S_IFREG ? stats[8] : 0;
        if (file.size === 0) {
            file.context = null;
            return file.close(context);
        }
        context.buffer = Buffer.allocUnsafe(context.readLength = file.size > highWaterMark ? highWaterMark : file.size);
        file.readChunk(context);
    }
    newContext(streamer) {
        if (this.size === 0)
            return streamer.end(nullBuffer, 0);
        this.connections++;
        this.context = new MultiWritableContext(this);
        this.context.streamers.push(streamer);
        this.context.size = this.size;
        this.context.buffer = Buffer.allocUnsafe(this.context.readLength = this.size > highWaterMark ? highWaterMark : this.size);
        file.readChunk(this.context);
    }
    readChunk(context) {
        const req = new FSReqCallback();
        req.oncomplete = this.#readChunkAfterRead;
        req.context = context;
        read(this.fd, context.buffer, 0, context.readLength, context.pos, req);
    }
    #readChunkAfterRead(error, bytesRead) {
        const context = this.context;
        const file = context.file;
        if (file.error = file.error ?? error) {
            if (typeof file.error.status === "undefined")
                file.error.status = 500;
            return file.onError(context, file.error);
        }
        if (file.context === context)
            file.context = null;
        context.pos += bytesRead;
        context.size -= bytesRead;
        if (bytesRead === highWaterMark && context.size !== 0)
            return context.write();
        file.close(context);
    }
    close(context) {
        if (--this.connections === 0) {
            if (streaming[this.filepath])
                --counter !== 0
                    ? streaming[this.filepath] = null
                    : streaming = {}
            const req = new FSReqCallback();
            req.oncomplete = this.#closeReadableFileAfterClose;
            req.context = context;
            return close(this.fd, req);
        }
        context.end();
    }
    #closeReadableFileAfterClose(error) {
        const context = this.context;
        const file = context.file;
        file.error = file.error ?? error
            ? typeof file.error.status === "undefined"
                ? file.error.status = 500
                : file.onError(context, file.error)
            : context.end();
    }
    onError(context, error) {
        if (streaming[this.filepath])
            --counter !== 0
                ? streaming[this.filepath] = null
                : streaming = {}
        if (this.context === context)
            this.context = null;
        if (this.fd === null)
            return context.sendErrors(error);
        this.#errorReadableFile(context, error);
    }
    #errorReadableFile(context, error) {
        const req = new FSReqCallback();
        req.oncomplete = context.file.#errorReadableFileAfterClose;
        req.context = context;
        req.error = error;
        close(this.fd, req);
        this.fd = null;
    }
    #errorReadableFileAfterClose(closeError) {
        let { context, error } = this;
        if (closeError) {
            closeError.status = 500;
            error = closeError;
        }
        context.sendErrors(error);
    }
}
module.exports = class FileStream {
    bytes = 0;
    constructor(response, queue) {
        this.queue = queue;
        this.response = response;
    }
    send(filepath) {
        if (!this.response.hasHeader("content-type"))
            this.response.setHeader("content-type", mimetypes[parse(filepath).ext] ?? "text/plain");
        this.queue.push(this.#queueSendFile, this, filepath);
        return this.response;
    }
    #queueSendFile(req, res, next, streamer, filepath) {
        streamer.next = next;
        streaming[filepath]
            ? streaming[filepath].context === null
                ? streaming[filepath].newContext(streamer)
                : streaming[filepath].context.streamers.push(streamer)
            : streaming[filepath] = new MultiReadableFile(filepath, streamer);
    }
    end(buffer, bytes) {
        this.bytes += bytes;
        if (this.queue.lastIndex) {
            this.queue.push(this.destroyStream, this);
            this.response.apiRecord?.report(this.bytes);
            return this.response.write(buffer, "utf8", () => process.nextTick(this.next));
        }
        this.response.write(buffer, "utf8", () => process.nextTick(this.next));
    }
    destroyStream(req, res, next, streamer) {
        streamer.response.end(nullBuffer);
        streamer.response = null;
        streamer.next = null;
    }
};