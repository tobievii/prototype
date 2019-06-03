
import * as events from "events"
import * as net from "net";
import { mqttConnection } from "./mqttConnection"
import * as _ from "lodash"


import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');

export class PluginMQTT extends Plugin {
    serversMem: any[] = [];
    db: any;
    app: any;
    eventHub: events.EventEmitter;
    name = "MQTT";

    mqttConnections: any = [];

    constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
        super(app, db, eventHub);
        this.db = db;
        this.app = app;
        this.eventHub = eventHub;

        log("PLUGIN", this.name, "LOADED");

        var server = net.createServer((socket: any) => {
            var client = new mqttConnection(socket)

            client.on("connect", (data) => {
                this.mqttConnections.push(client);
            })

            client.on("subscribe", (packet) => {
                if (client.subscriptions.includes(packet.subscribe) == false) {
                    client.subscriptions.push(packet.subscribe)
                }
            })

            client.on("publish", (publish) => {
                log("PLUGIN", this.name, "PUBLISH Received");
                var requestClean: any = {}

                try {
                    requestClean = JSON.parse(publish.payload)
                    requestClean.meta = { "User-Agent": "MQTT", "method": "publish", "socketUuid": client.uuid }
                    this.eventHub.emit("device", { apikey: publish.topic, packet: requestClean })
                } catch (err) {
                    log(err);
                }
            })

            client.on("error", (err) => { log(err); })

            client.on("ping", () => { })
        });

        server.listen(1883);
    }

    handlePacket(db: any, packet: any, cb: any) {
        for (var mqttConnection of this.mqttConnections) {
            for (var sub of mqttConnection.subscriptions) {
                if ((sub == packet.apikey) || (sub == packet.apikey + "|" + packet.devid)) {
                    var temp = _.clone(packet.payload);
                    delete temp["meta"]
                    delete temp.timestamp
                    if (temp.err != undefined) {
                        if (temp.err == "") {
                            delete temp.err
                        }
                    }

                    if (mqttConnection.connected) {
                        var sendit = true;

                        // check if this is not the same socket that sent the packet, if so then we do not echo it back.
                        if (_.has(packet, "payload.meta.socketUuid")) {
                            if (packet.payload.meta.socketUuid == mqttConnection.uuid) {
                                sendit = false;
                            }
                        }

                        if (sendit) { mqttConnection.publish(packet.apikey, JSON.stringify(temp)) }
                    }
                }
            }
        }
    }

}