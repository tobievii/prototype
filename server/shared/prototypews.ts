import { EventEmitter } from "events";

const WebSocket = require('isomorphic-ws')

export class PrototypeWS extends EventEmitter {
    socket: any;
    apikey: string;
    connected = false;

    constructor(options: { uri: string, apikey: string }) {
        super();
        this.apikey = options.apikey;
        console.log("PrototypeWS init")
        this.socket = new WebSocket(options.uri);

        this.socket.onopen = () => {
            console.log('connect');
            this.sendJSON({ apikey: options.apikey });
        };

        this.socket.onclose = function close() {
            console.log('disconnected');
        };

        this.socket.onmessage = (message: any) => {

            if (message.data) {
                try {
                    var msg = JSON.parse(message.data);
                    console.log(msg);

                    if (msg.auth == "success") {
                        this.emit("connect");
                        this.connected = true;
                    }

                    if (msg.states) {
                        this.emit("states", msg.states)
                    }
                } catch (err) {
                    console.error(err);
                }

            }

        };

        this.on("join", (apikey) => { })
    }


    sendJSON(data: object) {
        this.socket.send(JSON.stringify(data));
    }

    subscribe(key: string) {
        if (this.connected) {
            console.log("subscribing to " + key)
            this.socket.send(JSON.stringify({ key }))
        } else {
            this.on("connect", () => {
                this.socket.send(JSON.stringify({ key }))
            })
        }
    }
}