"use strict";
const fs = require("fs");
const path = require("path");
const mimetypes = require("./fileTransfer");
class PipeFile extends fs.ReadStream {
	#mimetype;
	#response;
	constructor(response, filepath, options) {
		super("./" + filepath, { encoding: "utf8" });
		this.on("error", this.onError);
		this.on("open", this.onOpen);
		this.on("end", this.onEnd);
		this.#mimetype = mimetypes[path.parse(filepath).ext];
		this.#response = response;
		this.pipe(response, options);
	};
	onError(error) {
		this.#response.sendError(404, error);
	};
	onOpen() {
		this.#response.setHeader("content-type", this.#mimetype);
	};
	onEnd() {
		this.#response.report(this.bytesRead)
	}
};
module.exports = PipeFile;
