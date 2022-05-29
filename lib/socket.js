"use strict";
const { errnoException } = require("./error");
let debug = require('util').debuglog('net', fn => debug = fn);
module.exports = emper => {
    class Socket extends require("net").Socket {
        get remoteUrl() {
            return this.remoteAddress + ":" + this.remotePort;
        }
    }
    emper.Socket = Socket;
    function emper_onconnection(error, clientHandle) {
        const server = emper.server;
        debug('onconnection');
        if (error)
            return server.emit('error', errnoException(error, 'accept'));
        if (server.maxConnections && server._connections >= server.maxConnections)
            return clientHandle.close();
        const socket = new emper.Socket({
            handle: clientHandle,
            allowHalfOpen: server.allowHalfOpen,
            pauseOnCreate: server.pauseOnConnect,
            readable: true,
            writable: true
        });
        server._connections++;
        socket.server = socket._server = server;
        server.emit('connection', socket);
    };
    emper.listeningListener = function () {
        this._handle.onconnection = emper_onconnection;
    };
    return Socket;
};