"use strict";
const httpMethods = require("./httpMethods");
module.exports = () => {
    class ApiRecord {
        constructor() {
            this.reset();
        }
        report(byteLength) {
            this.counter++;
            this.bytes += byteLength;
        }
        reset() {
            this.counter = 0;
            this.bytes = 0;
            return this;
        }
        from(record) {
            if (record) {
                this.counter = record.counter || 0;
                this.bytes = record.bytes || 0;
            }
        }
    }
    let currentApiRecord = ApiRecord;
    return class ApiRegister {
        #apis = {};
        register(path, method) {
            const api = this.#apis[path] ??= {};
            return api[method]
                ? Object.setPrototypeOf(api[method], ApiRegister.#ApiRecord.prototype)
                : api[method] = new (ApiRegister.#ApiRecord)();
        }
        load(register, call) {
            for (const path in this.#apis) {
                const api = this.#apis[path];
                const loadingApi = register[path] !== null && typeof register[path] === "object"
                    ? register[path]
                    : {};
                register[path] = api;
                for (const method in api)
                    if (httpMethods.has(method))
                        api[method][call](loadingApi[method]);
            }
            this.#apis = register;
        }
        get apis() {
            return this.#apis;
        }
        static #ApiRecord = ApiRecord;
        static get ApiRecord() {
            return currentApiRecord;
        }
        static set ApiRecord(OwnApiRecord) {
            if (OwnApiRecord === null)
                return currentApiRecord = ApiRecord;
            else if (!Object.create(OwnApiRecord.prototype) instanceof ApiRecord)
                throw TypeError(`The parameter OwnApiRecord is not a child of ApiRecord`);
            currentApiRecord = OwnApiRecord;
        }
    }
}