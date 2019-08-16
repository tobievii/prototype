
/*
// https://mongoosejs.com/
// https://pusher.com/tutorials/mongodb-change-streams
*/

import * as mongoose from "mongoose"
import { logger } from "./log";
import { EventEmitter } from "events";

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
            logger.log({ message: "mongojs db connected", level: "debug" })
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
                logger.log({ message: "mongoose db open", level: "debug" })

                // add listeners
                mongoose.connection.collection("users").watch().on("change", (change) => {
                    logger.log({ message: "db change", data: { change }, level: "debug" });
                    this.emit("users", change)
                })

                mongoose.connection.collection("states").watch().on("change", (change) => {
                    logger.log({ message: "db change", data: { change }, level: "debug" });
                    this.emit("states", change)
                })

                mongoose.connection.collection("packets").watch().on("change", (change) => {
                    logger.log({ message: "db change", data: { change }, level: "debug" });
                    this.emit("packets", change)
                })

                mongoose.connection.on("error", (err) => { logger.log({ message: err.toString(), level: "error" }) });

                //ready
                this.emit("ready");
            }
        });
    }

}