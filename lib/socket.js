"use strict";
let debug = require('util').debuglog('net', fn => debug = fn);
const { errnoException } = require("./error");
// const { memoryMeasure } = require("../dev-lib/memoryTime");
class Socket extends require("net").Socket {
    constructor(options) {
        super(options);
        const { server } = options;
        server._connections++;
        this.server = this._server = server;
        server.emit('connection', this);
        // this.once("close", memoryMeasure);
    };
    get remoteUrl() {
        return this.remoteAddress + ":" + this.remotePort;
    };
};
let owner_symbol = null;
let EmperSocket = Socket;
module.exports = {
    get Socket() {
        return EmperSocket;
    },
    set Socket(OwnSocket) {
        if (OwnSocket === null) return EmperSocket = Socket;
        else if (!isDerived(OwnSocket, Socket)) throw TypeError(`The parameter IncomingMessage is not derived from Request`);
        EmperSocket = OwnSocket;
    },
    onconnection(error, clientHandle) {
        const handle = this;
        if (owner_symbol === null) owner_symbol = Object.getOwnPropertySymbols(handle)[0];
        const server = handle[owner_symbol];
        debug('onconnection');
        if (error) return server.emit('error', errnoException(error, 'accept'));
        if (server.maxConnections && server._connections >= server.maxConnections) return clientHandle.close();
        new EmperSocket({
            handle: clientHandle,
            allowHalfOpen: server.allowHalfOpen,
            pauseOnCreate: server.pauseOnConnect,
            readable: true,
            writable: true,
            server
        });
    }
};