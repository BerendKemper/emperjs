"use strict";
const { close, open, read, fstat, FSReqCallback } = process.binding('fs');
const { S_IFMT, S_IFREG, O_RDONLY } = require("fs").constants;
const { toNamespacedPath } = require("path");
const path = require("path");
const mimetypes = require("emperjs/lib/fileTypes");
const CallbackQueue = require("ca11back-queue");
let highWaterMark = 16384;
const streaming = {};
class MultiWritableContext {
    pos = 0;
    size = null;
    streamers = [];
    constructor(file) {
        this.file = file;
    };
    write() {
        let i;
        const afterWritten = () => {
            if (--i === 0) {
                if (this.size < highWaterMark) this.buffer = Buffer.allocUnsafe(this.readLength = this.size);
                this.file.readChunk(this);
            }
        };
        for (i = 0; i < this.streamers.length; i++)
            this.streamers[i].response.write(this.buffer, "utf8", afterWritten);
    };
    end() {
        for (const streamer of this.streamers)
            streamer.end(this.buffer, this.pos);
        this.buffer = null;
        this.streamers = null;
        this.file = null;
    };
    sendErrors(status, error) {
        for (const stream of this.streamers) {
            stream.queue.clear();
            stream.response.sendError(status, error);
        }
    };
};
function errorReadableFile(context, status, error) {
    const req = new FSReqCallback();
    req.oncomplete = errorReadableFileAfterClose;
    req.context = context;
    req.status = status;
    req.error = error;
    close(context.fd, req);
};
function errorReadableFileAfterClose(_error) {
    let { context, status, error } = this;
    if (_error) {
        status = 500;
        error = _error;
    }
    context.sendErrors(status, error);
};
function closeReadableFileAfterClose(error) {
    const context = this.context;
    if (error) return context.sendErrors(500, error);
    context.end();
};
function makeReadableFile(file) {
    const req = new FSReqCallback()
    req.oncomplete = makeReadableFileAfterOpen;
    req.file = file;
    open(toNamespacedPath(file.filepath), O_RDONLY, 0o666, req);
};
function makeReadableFileAfterOpen(error, fd) {
    const file = this.file;
    if (error) return file.onError(file.context, 404, error);
    file.fd = fd;
    const req = new FSReqCallback();
    req.oncomplete = makeReadableFileAfterStat;
    req.file = file;
    fstat(file.fd, false, req);
};
function makeReadableFileAfterStat(error, stats) {
    const file = this.file;
    const context = file.context;
    if (error) return file.onError(context, 500, error);
    context.size = file.size = (stats[1] & S_IFMT) === S_IFREG ? stats[8] : 0;
    context.buffer = Buffer.allocUnsafe(context.readLength = file.size > highWaterMark ? highWaterMark : file.size);
    file.readChunk(context);
};
function readChunkNewContext(file) {
    file.readChunk(file.context);
};
function readChunkAfterRead(error, bytesRead) {
    const context = this.context;
    const file = context.file;
    if (file.context === context) file.context = null;
    if (file.error = file.error ?? error) return file.onError(context, 500, file.error);
    context.pos += bytesRead;
    context.size -= bytesRead;
    if (bytesRead === highWaterMark) return context.write();
    file.close(context);
};
class MultiReadableFile {
    fd = null;
    connections = 1;
    context = new MultiWritableContext(this);
    error = null;
    constructor(filepath, streamer) {
        this.filepath = filepath;
        this.context.streamers.push(streamer);
        process.nextTick(makeReadableFile, this);
    };
    newContext(streamer) {
        this.connections++;
        this.context = new MultiWritableContext(this);
        this.context.streamers.push(streamer);
        this.context.size = this.size;
        this.context.buffer = Buffer.allocUnsafe(this.context.readLength = this.size > highWaterMark ? highWaterMark : this.size);
        process.nextTick(readChunkNewContext, this);
    };
    readChunk(context) {
        if (context.readLength === 0) {
            if (this.context === context) this.context = null;
            return this.close(context);
        }
        const req = new FSReqCallback();
        req.oncomplete = readChunkAfterRead;
        req.context = context;
        read(this.fd, context.buffer, 0, context.readLength, context.pos, req);
    };
    close(context) {
        if (--this.connections === 0) {
            streaming[this.filepath] = null;
            const req = new FSReqCallback();
            req.oncomplete = closeReadableFileAfterClose;
            req.context = context;
            return close(this.fd, req);
        }
        context.end();
    };
    onError(context, status, error) {
        if (this.fd === null) return context.sendErrors(status, error);
        process.nextTick(errorReadableFile, context, status, error);
        streaming[this.filepath] = null;
        this.fd = null;
    };
};
function queueSendFile(next, { filepath, end } = context) {
    this.mustEnd = end;
    this.next = next;
    streaming[filepath]
        ? streaming[filepath].context === null
            ? streaming[filepath].newContext(this)
            : streaming[filepath].context.streamers.push(this)
        : streaming[filepath] = new MultiReadableFile(filepath, this);
};
class MultiStreamableFile {
    constructor(response) {
        this.response = response;
        this.queue = new CallbackQueue(this);
    };
    send(filepath, end) {
        filepath = "." + filepath;
        if (!this.mimetype) {
            this.mimetype = mimetypes[path.parse(filepath).ext];
            this.response.setHeader("content-type", this.mimetype ?? "text/html");
        }
        this.queue.push(queueSendFile, { filepath, end });
        return this;
    };
    end(buffer, bytes) {
        this.response.report(bytes);
        if (this.mustEnd) {
            const next = this.next;
            this.response.end(buffer, "utf8", () => process.nextTick(next));
            this.queue.destroy();
            this.response = null;
            this.queue = null;
            this.next = null;
            return;
        }
        this.response.write(buffer, "utf8", () => process.nextTick(this.next));
    };
};
module.exports = MultiStreamableFile;