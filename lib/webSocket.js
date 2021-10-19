"use strict";
const crypto = require("crypto");

function upgarde(request) {
    console.log("sec-websocket-key:", request.headers["sec-websocket-key"]);
    const magicString = request.headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    console.log("magicString:", magicString);
    const digest = crypto.createHash("sha1").update(magicString).digest("base64");
    console.log("digest:", digest);
    // return upgradeChat + "s3pPLMBiTxaQ9kYGzzhZRbK+xOo=" + "\r\n";
    const secWebsocketAccept = "HTTP/" + request.httpVersion + " 101 Switching Protocols\r\n" +
        "Upgrade: websocket\r\n" +
        "Connection: Upgrade\r\n" +
        "Sec-WebSocket-Accept: " + digest + "\r\n\r\n"; // +
    // "Sec-WebSocket-Protocol: mongol\r\n\r\n";
    console.log("sec-websocket-accept:\r\n" + secWebsocketAccept);
    return secWebsocketAccept;
}
function dataListener(data) {
    console.log("data:", data, data.toString());
}
module.exports = function upgradeListener(request, socket, head) {
    socket.write(upgarde(request));
    socket.on("data", dataListener);
}