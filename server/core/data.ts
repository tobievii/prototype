
/*
// https://mongoosejs.com/
// https://pusher.com/tutorials/mongodb-change-streams
*/

import * as mongoose from "mongoose"
import { logger } from "./log";
import { EventEmitter } from "events";
import { threadId } from "worker_threads";

//var mongojs = require('mongojs')

var mongojs = require("mongojs")

export class DocumentStore extends EventEmitter {

    db: any;

    constructor(options: any) {
        super();
        this.connect(options)
    }

    connect(options: any) {
        this.db = mongojs("8bo", ["users", "packets", "states"]);

        this.db.on("connect", () => {
            // only triggers on first activity it seems.
            //logger.log({ message: "mongojs db connected", level: "verbose" })
        })

        this.db.on("error", (err: Error) => {
            logger.log({ message: "mongojs error", data: { err }, level: "error" })
        })

        mongoose.connect(options.mongoConnection, { useNewUrlParser: true }, (err) => {
            if (err) {
                logger.log({ message: "mongoose db connect error", data: { err }, level: "error" });
                setTimeout(() => {
                    this.connect(options); //retry every second
                }, 10000)
            } else {
                //logger.log({ message: "mongoose db open", level: "verbose" })

                // add listeners
                mongoose.connection.collection("users").watch().on("change", (change) => {
                    logger.log({ message: "db change", data: { change }, level: "verbose" });
                    this.emit("users", change)
                })

                mongoose.connection.collection("states").watch().on("change", (change) => {
                    logger.log({ message: "db change", data: { change }, level: "verbose" });
                    this.emit("states", change)
                })

                mongoose.connection.collection("packets").watch().on("change", (change) => {
                    logger.log({ message: "db change", data: { change }, level: "verbose" });
                    this.emit("packets", change)
                })

                mongoose.connection.on("error", (err) => { logger.log({ message: err.toString(), level: "error" }) });

                //ready
                this.emit("ready");
            }
        });

        this.createIndexes();
    }

    createIndexes() {
        //logger.log({ message: "mongo indexes", data: {}, level: "verbose" })

        //this.db.states.createIndex({ apikey: 1 })
        this.db.states.createIndex({ apikey: 1, id: 1 })
        // this.db.states.createIndex({ "_last_seen": 1 })
        // this.db.states.createIndex({ key: 1 })
        // this.db.states.createIndex({ "plugins_iotnxt_gateway.GatewayId": 1, "plugins_iotnxt_gateway.HostAddress": 1 }, { background: 1 })

        // this.db.packets.createIndex({ "_created_on": 1 })
        this.db.packets.createIndex({ apikey: 1, id: 1 })
        // this.db.packets.createIndex({ apikey: 1, devid: 1, "created_on": 1 })
        // this.db.packets.createIndex({ key: 1 }, { background: 1 })

        //this.db.users.createIndex({ uuid: 1 })
        this.db.users.createIndex({ apikey: 1 })
        this.db.users.createIndex({ email: 1 })
        // this.db.users.createIndex({ "_last_seen": 1 })
        // this.db.users.createIndex({ username: 1 }, { background: 1 })
        // this.db.users.createIndex({ email: 1 }, { background: 1 }) // gert's fix
        // this.db.users.createIndex({ email: "text", username: "text" }, { background: 1 })
    }
}