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
    }
    write() {
        let i;
        const afterWritten = () => {
            if (--i === 0) {
                if (this.size < highWaterMark)
                    this.buffer = Buffer.allocUnsafe(this.readLength = this.size);
                this.file.readChunk(this);
            }
        };
        for (i = 0; i < this.streamers.length; i++)
            this.streamers[i].response.write(this.buffer, "utf8", afterWritten);
    }
    end() {
        for (const streamer of this.streamers)
            streamer.end(this.buffer, this.pos);
        this.buffer = null;
        this.streamers = null;
        this.file = null;
    }
    sendErrors(error) {
        for (const stream of this.streamers) {
            stream.clear();
            stream.response.sendError(error.status, error);
        }
        this.buffer = null;
        this.streamers = null;
        this.file = null;
    }
}
function errorReadableFile(fd, context, error) {
    const req = new FSReqCallback();
    req.oncomplete = errorReadableFileAfterClose;
    req.context = context;
    req.error = error;
    close(fd, req);
}
function errorReadableFileAfterClose(_error) {
    let { context, error } = this;
    if (_error) {
        _error.status = 500;
        error = _error;
    }
    context.sendErrors(error);
}
function closeReadableFileAfterClose(error) {
    const context = this.context;
    const file = context.file;
    if (file.error = file.error ?? error) {
        if (typeof file.error.status === "undefined")
            file.error.status = 500;
        return file.onError(context, file.error);
    }
    context.end();
}
function makeReadableFile(file) {
    const req = new FSReqCallback()
    req.oncomplete = makeReadableFileAfterOpen;
    req.file = file;
    open(toNamespacedPath(file.filepath), O_RDONLY, 0o666, req);
}
function makeReadableFileAfterOpen(error, fd) {
    const file = this.file;
    if (file.error = file.error ?? error) {
        if (typeof file.error.status === "undefined")
            file.error.status = 404;
        return file.onError(file.context, file.error);
    }
    file.fd = fd;
    const req = new FSReqCallback();
    req.oncomplete = makeReadableFileAfterStat;
    req.file = file;
    fstat(file.fd, false, req);
}
function makeReadableFileAfterStat(error, stats) {
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
function readChunkNewContext(file) {
    file.readChunk(file.context);
}
function readChunkAfterRead(error, bytesRead) {
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
class MultiReadableFile {
    fd = null;
    connections = 1;
    context = new MultiWritableContext(this);
    error = null;
    constructor(filepath, streamer) {
        this.filepath = filepath;
        this.context.streamers.push(streamer);
        process.nextTick(makeReadableFile, this);
    }
    newContext(streamer) {
        if (this.size === 0)
            return streamer.end(Buffer.allocUnsafe(0), 0);
        this.connections++;
        this.context = new MultiWritableContext(this);
        this.context.streamers.push(streamer);
        this.context.size = this.size;
        this.context.buffer = Buffer.allocUnsafe(this.context.readLength = this.size > highWaterMark ? highWaterMark : this.size);
        process.nextTick(readChunkNewContext, this);
    }
    readChunk(context) {
        const req = new FSReqCallback();
        req.oncomplete = readChunkAfterRead;
        req.context = context;
        read(this.fd, context.buffer, 0, context.readLength, context.pos, req);
    }
    close(context) {
        if (--this.connections === 0) {
            streaming[this.filepath] = null;
            const req = new FSReqCallback();
            req.oncomplete = closeReadableFileAfterClose;
            req.context = context;
            return close(this.fd, req);
        }
        context.end();
    }
    onError(context, error) {
        if (file.context === context)
            file.context = null;
        if (this.fd === null)
            return context.sendErrors(error);
        process.nextTick(errorReadableFile, this.fd, context, error);
        streaming[this.filepath] = null;
        this.fd = null;
    }
}
function queueSendFile(next, { filepath, end } = context) {
    this.mustEnd = end;
    this.next = next;
    streaming[filepath]
        ? streaming[filepath].context === null
            ? streaming[filepath].newContext(this)
            : streaming[filepath].context.streamers.push(this)
        : streaming[filepath] = new MultiReadableFile(filepath, this);
}
class MultiStreamableFile extends CallbackQueue {
    constructor(response) {
        super();
        this.response = response;
    }
    send(filepath, end) {
        filepath = "." + filepath;
        if (!this.mimetype) {
            this.mimetype = mimetypes[path.parse(filepath).ext];
            this.response.setHeader("content-type", this.mimetype ?? "text/plain");
        }
        this.push(queueSendFile, { filepath, end });
        return this;
    }
    end(buffer, bytes) {
        this.response.report(bytes);
        if (this.mustEnd) {
            const next = this.next;
            this.response.end(buffer, "utf8", () => process.nextTick(next));
            this.clear();
            this.response = null;
            return this.next = null;
        }
        this.response.write(buffer, "utf8", () => process.nextTick(this.next));
    }
}
module.exports = MultiStreamableFile;