"use strict";
const { errnoException } = require("./error");
let debug = require('util').debuglog('net', fn => debug = fn);
let owner_symbol = null;
module.exports = emper => {
    class Socket extends require("net").Socket {
        constructor(options) {
            super(options);
            const { server } = options;
            server._connections++;
            this.server = this._server = server;
            server.emit('connection', this);
        }
        get remoteUrl() {
            return this.remoteAddress + ":" + this.remotePort;
        }
        static get EmperSocket() {
            return EmperSocket;
        }
        static set EmperSocket(OwnSocket) {
            if (OwnSocket === null)
                return EmperSocket = this;
            else if (!Object.create(OwnSocket.prototype) instanceof this)
                throw TypeError(`The parameter IncomingMessage is not derived from Request`);
            EmperSocket = OwnSocket;
        }
    }
    let EmperSocket = Socket;
    function emper_onconnection(error, clientHandle) {
        const handle = this;
        if (owner_symbol === null)
            owner_symbol = Object.getOwnPropertySymbols(handle)[0];
        const server = handle[owner_symbol];
        debug('onconnection');
        if (error)
            return server.emit('error', errnoException(error, 'accept'));
        if (server.maxConnections && server._connections >= server.maxConnections)
            return clientHandle.close();
        new EmperSocket({
            handle: clientHandle,
            allowHalfOpen: server.allowHalfOpen,
            pauseOnCreate: server.pauseOnConnect,
            readable: true,
            writable: true,
            server
        });
    };
    emper.listeningListener = function () {
        this._handle.onconnection = emper_onconnection;
    };
    return Socket;
};