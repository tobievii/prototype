var socket = require("socket.io-client")("http://localhost:8080")

import { EventEmitter } from "events"

export class SocketProto extends EventEmitter {
    constructor (key: any) {
        super();

        socket.on("connect", () => {
            this.emit('connect', {});
            console.log("socket connect")
            socket.emit("join", key); // your api key

            socket.on("post", function(data: any) {
                console.log(data);
            });
        });
    }
}