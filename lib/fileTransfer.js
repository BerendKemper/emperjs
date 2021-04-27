"use strict";
const fs = require("fs");
const path = require("path");
const mimetypes = require("./fileTypes");
const CallbackQueue = require("ca11back-queue");
let highWaterMark = 16384;
class FileTransfer {
	queue = new CallbackQueue();
	constructor(response) {
		this.response = response;
	};
	readPortion(context) {
		fs.read(context.fd, context.buffer, 0, context.readLength, context.pos, (error, bytesRead) => {
			if (error)
				return this.queue.clear(this.response.sendError(404, error));
			if (bytesRead === highWaterMark) {
				context.pos += bytesRead;
				context.size -= bytesRead;
				this.response.write(context.buffer, "utf8", () => {
					if (context.size < highWaterMark)
						context.buffer = Buffer.allocUnsafe(context.readLength = context.size);
					this.readPortion(context);
				});
			}
			else if (bytesRead === context.readLength)
				if (this.end)
					this.response.end(context.buffer, "utf8", context.callback).report(context.pos + bytesRead);
				else {
					this.response.write(context.buffer, "utf8", context.callback);
					this.response.report(context.pos + bytesRead);
				}
			else if (bytesRead === 0)
				this.end ? this.response.end(Buffer.from(""), "utf8", context.callback).report(0) : context.callback();
		});
	};
	send(filepath, end) {
		if (!this.mimetype) {
			this.mimetype = mimetypes[path.parse(filepath).ext];
			this.response.setHeader("content-type", this.mimetype);
		}
		this.queue.push(next => {
			this.end = end;
			fs.open("." + filepath, 'r', 0o666, (error, fd) => {
				if (error)
					return this.queue.clear(this.response.sendError(404, error));
				fs.fstat(fd, false, (error, stats) => {
					if (error)
						return this.queue.clear(this.response.sendError(404, error));
					const readLength = stats.size > highWaterMark ? highWaterMark : stats.size;
					this.readPortion({
						fd,
						pos: 0,
						readLength,
						size: stats.size,
						buffer: Buffer.allocUnsafe(readLength),
						callback: next
					});
				});
			});
		});
	};
};
module.exports = FileTransfer;
