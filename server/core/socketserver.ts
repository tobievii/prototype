import { EventEmitter } from "events";
var socketio = require('socket.io');
import * as WebSocket from "ws";
import { logger } from "./log"

export class SocketServer extends EventEmitter {
    server;
    io: any;
    wss: WebSocket.Server;

    constructor(options?: any) {
        super();
        if (options.server) this.server = options.server;

        // socketio:


        this.io = socketio(this.server);

        this.io.on("connection", (socket: any) => {
            socket.on("join", (path) => {
                logger.log({ message: "socket join", data: { path }, level: "verbose" })
                socket.join(path);
            })

            socket.on("post", (data) => {
                console.log("socket.io post:")
            })
        })

        this.on("packets", (packets) => {
            if (packets.operationType == "insert") {
                // new packet
                if (packets.fullDocument) {
                    if (packets.fullDocument.apikey) {
                        this.io.to(packets.fullDocument.apikey).emit("post", packets.fullDocument)
                        this.io.to(packets.fullDocument.apikey + "|" + packets.fullDocument.id).emit("post", packets.fullDocument)
                    }
                }
            }
        })

        // websocket:

        // this.wss = new WebSocket.Server({ server: this.server })

        // this.wss.on('connection', (ws) => {
        //     console.log("conn")
        //     ws.on('message', (data) => {
        //         logger.log({ message: "ws received", data: { wsmessage: data }, level: "info" })
        //     });
        //     //ws.send('hello to prototype server');
        // });

    }
}