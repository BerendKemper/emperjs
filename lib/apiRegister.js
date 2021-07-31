"use strict";
const isDerived = require("is-derived");
module.exports = context => {
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
            if (record) {
                this.counter = record.counter || 0;
                this.bytes = record.bytes || 0;
            }
        };
    };
    let currentApiRecord = ApiRecord;
    return class ApiRegister {
        #apis = {};
        register(path, method) {
            if (!this.#apis[path]) this.#apis[path] = {};
            const api = this.#apis[path];
            return api[method] ? Object.setPrototypeOf(api[method], ApiRegister.#ApiRecord.prototype) : api[method] = new (ApiRegister.#ApiRecord)();
        };
        load(register) {
            this.#apis = register;
        };
        get apis() {
            return this.#apis;
        };
        static #ApiRecord = ApiRecord;
        static get ApiRecord() {
            return currentApiRecord;
        };
        static set ApiRecord(OwnApiRecord) {
            if (OwnApiRecord === null) return currentApiRecord = ApiRecord;
            else if (!isDerived(OwnApiRecord, ApiRecord)) throw TypeError(`The parameter OwnApiRecord is not a child of ApiRecord`);
            currentApiRecord = OwnApiRecord;
        };
    };
};