import { EventEmitter } from "events";
var socketio = require('socket.io');

import { Server } from "socket.io"

import * as WebSocket from "ws";
import { logger } from "./log"
import { Core } from "./core"

import { Express } from "express"
import { Http2SecureServer } from "http2";

import * as http from "http";
import * as https from "https";

export class SocketServer extends EventEmitter {
    server: http.Server | https.Server;
    io: Server;

    constructor(options: { server: http.Server | https.Server, core: Core }) {
        super();
        this.server = options.server;

        this.io = socketio(this.server);

        this.io.on("connection", (socket: any) => {
            socket.on("join", (path: string, cb?: Function) => {
                var key = path.split("|")
                options.core.user({ apikey: key[0] }, (err, user) => {
                    if (err) {
                        logger.log({ message: "socket join error", data: { path }, level: "error" })
                    }
                    if (user) {
                        socket.user = user;
                        logger.log({ message: "socket join", data: { path }, level: "verbose" })
                        socket.join(path);
                        if (cb) cb();
                    }
                })
            })

            socket.on("post", (packet: any, cb?: Function) => {
                logger.log({ message: "socket post", data: { packet }, level: "verbose" })
                options.core.datapost({ user: socket.user, packet }, (err, result) => {
                    if (result) {
                        if (cb) cb({ result });
                    }
                })
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