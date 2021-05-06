"use strict";
const fs = require("fs");
const path = require("path");
const mimetypes = require("emperjs/lib/fileTypes");
const CallbackQueue = require("ca11back-queue");
let highWaterMark = 16384;
class FileStreamer {
	queue = new CallbackQueue();
	constructor(response) {
		this.response = response;
	};
	readChunk(context) {
		fs.read(context.fd, context.buffer, 0, context.readLength, context.pos, (error, bytesRead) => {
			if (error) return this.queue.clear(this.response.sendError(404, error));
			if (bytesRead === highWaterMark) {
				context.pos += bytesRead;
				context.size -= bytesRead;
				return this.response.write(context.buffer, "utf8", () => {
					if (context.size < highWaterMark)
						context.buffer = Buffer.allocUnsafe(context.readLength = context.size);
					this.readChunk(context);
				});
			}
			fs.close(context.fd, () => {
				if (bytesRead === context.readLength)
					this.end
						? this.response.report(context.pos + bytesRead, this.response = null).end(context.buffer, "utf8", context.callback)
						: this.response.report(context.pos + bytesRead).write(context.buffer, "utf8", context.callback);
				else if (bytesRead === 0)
					this.end
						? this.response.end(Buffer.from(""), "utf8", context.callback, this.response = null)
						: context.callback();
			});
		});
	};
	send(filepath, end) {
		if (!this.mimetype) {
			this.mimetype = mimetypes[path.parse(filepath).ext];
			this.response.setHeader("content-type", this.mimetype);
		}
		this.queue.push(next => {
			this.end = end;
			process.nextTick(() => {
				fs.open("." + filepath, 'r', 0o666, (error, fd) => {
					if (error) return this.queue.clear(this.response.sendError(404, error));
					fs.fstat(fd, false, (error, stats) => {
						if (error) return this.queue.clear(this.response.sendError(404, error));
						const readLength = stats.size > highWaterMark ? highWaterMark : stats.size;
						this.readChunk({
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
		});
	};
};
// module.exports = FileStreamer;
//*
class MultiWritableContext {
	pos = 0;
	size = null;
	streamers = [];
	write(file) {
		let i;
		for (i in this.streamers)
			this.streamers[i].response.write(this.buffer, "utf8", () => {
				if (--i === -1) {
					if (this.size < highWaterMark) this.buffer = Buffer.allocUnsafe(this.readLength = this.size);
					file.readChunk(this);
				}
			});
	};
	end() {
		let i;
		// this.multiReadBytesSaved = (this.streamers.length - 1) * this.pos;
		for (i in this.streamers) {
			this.streamers[i].end(this.buffer, this.pos);
		}
		this.streamers = null;
	};
	sendErrors(error) {
		for (const stream of this.streamers) {
			stream.queue.clear();
			stream.response.sendError(404, error);
		}
	};
};
class MultiReadableFile {
	fd = -1
	connections = 1;
	context = new MultiWritableContext();
	error = null;
	constructor(filepath, streamer) {
		this.filepath = filepath;
		this.context.streamers.push(streamer);
		process.nextTick(() => {
			fs.open("." + filepath, 'r', 0o666, (error, fd) => {
				if (error) {
					delete (streaming[this.filepath]);
					for (const streamer of this.context.streamers)
						streamer.response.sendError(400, error);
					return;
				}
				this.fd = fd;
				fs.fstat(fd, false, (error, stats) => {
					if (error) return this.close(() => this.context.sendErrors(error));
					this.context.size = this.size = stats.size;
					this.context.buffer = Buffer.allocUnsafe(this.context.readLength = stats.size > highWaterMark ? highWaterMark : stats.size);
					this.readChunk(this.context);
				});
			});
		});
	};
	newContext(streamer) {
		this.connections++;
		this.context = new MultiWritableContext();
		this.context.streamers.push(streamer);
		this.context.size = this.size;
		this.context.buffer = Buffer.allocUnsafe(this.context.readLength = this.size > highWaterMark ? highWaterMark : this.size);
		process.nextTick(() => this.readChunk(this.context));
		// this.readChunk(this.context);
	};
	readChunk(context) {
		fs.read(this.fd, context.buffer, 0, context.readLength, context.pos, (error, bytesRead) => {
			if (this.context === context) this.context = null;
			if (this.error = this.error || error) return this.close(() => context.sendErrors(this.error));
			context.pos += bytesRead;
			context.size -= bytesRead;
			if (bytesRead === highWaterMark) return context.write(this);
			this.close(closed => {
				if (bytesRead === 0) context.buffer = Buffer.from("");
				context.end();
				// this.multiReadBytesSaved += context.multiReadBytesSaved;
				// if (closed) console.log(`Saved ${this.multiReadBytesSaved} bytes from multi-reading`);
			});
		});
	};
	close(callback) {
		if (--this.connections === 0) {
			delete (streaming[this.filepath]);
			return fs.close(this.fd, error => {
				if (error) throw error;
				callback(true);
			});
		}
		callback(false);
	};
	// multiReadBytesSaved = 0;
};
const streaming = {};
class MultiStreamableFile {
	queue = new CallbackQueue();
	constructor(response) {
		this.response = response;
	};
	send(filepath, end) {
		if (!this.mimetype) {
			this.mimetype = mimetypes[path.parse(filepath).ext];
			this.response.setHeader("content-type", this.mimetype);
		}
		this.queue.push(next => {
			this.end = (buffer, bytes) => {
				if (end) {
					this.response
						.report(bytes)
						.end(buffer, "utf8", () => process.nextTick(next));
					this.response = null;
				}
				else {
					this.response
						.report(bytes)
						.write(buffer, "utf8", () => process.nextTick(next));
				}
			};
			if (streaming[filepath])
				streaming[filepath].context === null
					? streaming[filepath].newContext(this)
					: streaming[filepath].context.streamers.push(this);
			else
				streaming[filepath] = new MultiReadableFile(filepath, this);
		});
		return this;
	};
};
module.exports = { FileStreamer, MultiStreamableFile };
//*/