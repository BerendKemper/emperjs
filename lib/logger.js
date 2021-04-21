"use strict";
class Logger {
	#log = console.log;
	get log() {
		return this.#log;
	};
	set log(fn) {
		if (typeof fn !== "function")
			throw new TypeError("log must be a function");
		this.#log = fn;
	};
	#error = console.error;
	get error() {
		return this.#error;
	};
	set error(fn) {
		if (typeof fn !== "function")
			throw new TypeError("error must be a function");
		this.#error = fn;
	};
};
const logger = new Logger();
module.exports = logger;