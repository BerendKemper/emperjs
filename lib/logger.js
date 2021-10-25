"use strict";
module.exports = class Logger {
    #log = console.log;
    #error = console.error;
    #debug = console.log;
    get log() {
        return this.#log;
    }
    set log(fn) {
        if (typeof fn !== "function") throw new TypeError("log must be a function");
        this.#log = fn;
    }
    get error() {
        return this.#error;
    }
    set error(fn) {
        if (typeof fn !== "function") throw new TypeError("error must be a function");
        this.#error = fn;
    }
    get debug() {
        return this.#debug;
    }
    set debug(fn) {
        if (typeof fn !== "function") throw new TypeError("error must be a function");
        this.#debug = fn;
    }
}