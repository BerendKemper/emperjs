"use strict";
const isDerived = require("is-derived");
class ApiRecord {
	constructor() {
		this.reset();
	};
	reset() {
		this.counter = 0;
		this.bytes = 0;
		return this;
	};
	from(record) {
		if (!record)
			return this.reset();
		this.counter = record.counter;
		this.bytes = record.bytes;
	};
};
class ApiRegister {
	#apis;
	constructor(register) {
		this.#apis = register || {};
	};
	register(path, method) {
		if (!this.#apis[path])
			this.#apis[path] = {};
		const api = this.#apis[path];
		return api[method] ? Object.setPrototypeOf(api[method], ApiRegister.#ApiRecord.prototype) : api[method] = new (ApiRegister.#ApiRecord)();
	};
	get apis() {
		return this.#apis;
	};
	static #ApiRecord = ApiRecord;
	static get ApiRecord() {
		return ApiRegister.#ApiRecord;
	};
	static set ApiRecord(OwnApiRecord) {
		if (!isDerived(OwnApiRecord, ApiRecord))
			throw TypeError(`The parameter OwnApiRecord is not a child of ApiRecord`);
		ApiRegister.#ApiRecord = OwnApiRecord;
	};
};
module.exports = ApiRegister;