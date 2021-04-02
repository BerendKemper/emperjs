"use strict";
const isParent = require("./isParent");
class ApiRecord {
	constructor() {
		this.reset();
	};
	reset() {
		this.counter = 0;
		this.bytes = 0;
	};
};
class ApiRegister {
	#register;
	constructor(register) {
		this.#register = register ? register : {};
	};
	register(path, method) {
		if (!this.#register[path])
			this.#register[path] = {};
		const api = this.#register[path];
		return api[method] ? Object.setPrototypeOf(api[method], ApiRegister.#ApiRecord.prototype) : api[method] = new (ApiRegister.#ApiRecord)();
	};
	get apis() {
		return this.#register;
	};
	static #ApiRecord = ApiRecord;
	static get ApiRecord() {
		return ApiRegister.#ApiRecord;
	};
	static set ApiRecord(OwnApiRecord) {
		isParent(OwnApiRecord, ApiRecord);
		ApiRegister.#ApiRecord = OwnApiRecord;
	};
};
module.exports = ApiRegister;