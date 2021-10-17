"use strict";
const { close, open, read, fstat, FSReqCallback } = process.binding('fs');
const { S_IFMT, S_IFREG, O_RDONLY } = require("fs").constants;
const { toNamespacedPath } = require("path");
const path = require("path");
const mimetypes = require("emperjs/lib/fileTypes");
const CallbackQueue = require("ca11back-queue");
let highWaterMark = 16384;
class ReadableFile {

}
class FileStreamManager {
    queFile(response, filepath, end) {
        if (!response.hasHeader("content-type"))
            this.response.setHeader("content-type", mimetypes[path.parse(filepath).ext] ?? "text/plain");

    }
}
return new FileStreamManager();