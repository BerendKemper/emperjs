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
        const patterns = [];
        let curr_pattern = [];
        let next_pattern = [];
        for (let i = 0; i < data.byteLength; i++) {
            const byte = data[i];
            curr_pattern.length > 6 && curr_pattern.at(-4) !== byte
        }






        // console.log(data.byteLength, data.length, "[", Array.prototype.join.call(data.slice(-50), ","), "]");
        // if (data.byteLength === 6)
        //     return console.log("data was an empty sting");
        // else if (data.byteLength < 134) {
        //     const noob = data.subarray(0, 2);
        //     const mask = [data[4], data[5], data[2], data[3]];
        //     const f8data = data.subarray(8, 16);
        //     const l8data = data.subarray(-8);
        //     console.log("[noob, mask]: [ [", Array.prototype.join.call(noob, ","), "], [", Array.prototype.join.call(mask, ","), "] ]");
        //     console.log("[f8dt, l8dt]: [ [", Array.prototype.join.call(f8data, ","), "], [", Array.prototype.join.call(l8data, ","), "] ]");
        //     for (let i = 6; i < data.byteLength; i++) {
        //         data[i] ^= mask[i % 4];
        //     }
        //     // if (data.slice(6).toString() === "test") {
        //     //     const test = Buffer.from(JSON.stringify("test") + "\r\n\r\n");
        //     //     this.write(originalData, () => console.log("written"));
        //     // }
        //     return console.log(data.slice(6).toString());
        // } else /*if (data.byteLength < 65536 && data[3] < 249)*/ { //129,254,255,249
        //     const noob = data.subarray(0, 4);
        //     const mask = data.subarray(4, 8);
        //     const f8data = data.subarray(8, 16);
        //     const l8data = data.subarray(-8);
        //     console.log("[noob, mask]: [ [", Array.prototype.join.call(noob, ","), "], [", Array.prototype.join.call(mask, ","), "] ]");
        //     console.log("[f8dt, l8dt]: [ [", Array.prototype.join.call(f8data, ","), "], [", Array.prototype.join.call(l8data, ","), "] ]");
        //     for (let i = 8; i < data.byteLength; i++) {
        //         data[i] ^= mask[i % 4];
        //     }
        //     return console.log(data.subarray(8, 75 + 8).toString(), data.subarray(-75).toString());
        // }
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