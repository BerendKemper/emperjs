"use strict";
const crypto = require("crypto");
module.exports = emper => {
    const { logger, routes } = emper;
    function upgarde(request) {
        const magicString = request.headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
        const digest = crypto.createHash("sha1").update(magicString).digest("base64");
        const secWebsocketAccept = "HTTP/" + request.httpVersion + " 101 Switching Protocols\r\n" +
            "Upgrade: websocket\r\n" +
            "Connection: Upgrade\r\n" +
            "Sec-WebSocket-Accept: " + digest + "\r\n\r\n"; // +
        // "Sec-WebSocket-Accept: " + digest + "\r\n" +
        // "Sec-WebSocket-Protocol: json\r\n\r\n";
        return secWebsocketAccept;
    }
    /**@param {Buffer} data*/
    function dataListener(data) {
        console.log(data.byteLength, Array.prototype.reduce.call(data, (decode, byte) => decode += ` ${byte},`, "[").slice(0, -1) + " ]");
        if (data.byteLength === 6)
            return console.log("this happened");
        else if (data.byteLength < 134) {
            const originalData = data.slice()
            const mask = [data[4], data[5], data[2], data[3]];
            for (let i = 6; i < data.byteLength; i++) {
                data[i] ^= mask[i % 4];
            }
            // if (data.slice(6).toString() === "test") {
            //     const test = Buffer.from(JSON.stringify("test") + "\r\n\r\n");
            //     this.write(originalData, () => console.log("written"));
            // }
            return console.log(data.slice(6).toString());
        } else {
            const mask = data.slice(4, 8);
            for (let i = 8; i < data.byteLength; i++) {
                data[i] ^= mask[i % 4];
            }
            return console.log(data.slice(8).toString());
        }
    }
    function errorListener(error, ...data) {
        console.log("errorListener", error, data);
    }
    return function upgradeListener(request, socket, head) {
        socket.write(upgarde(request));
        socket.on("data", dataListener);
        socket.on("error", errorListener);
    }
};