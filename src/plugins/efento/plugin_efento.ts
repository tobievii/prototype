//import { MeasurementManager } from './utils/MeasurementManager';
const fs = require('fs');
var coap = require('coap');

import * as events from "events"
import { log } from "../../log"
import { Plugin } from "../plugin"
import express = require('express');
import MeasurementManager from "./MeasurementManager";
var Measurements, proto = require('../../../src/plugins/efento/nbiot_pb.js');
export class PluginEFENTO extends Plugin {
    serversMem: any[] = [];
    db: any;
    app: any;
    eventHub: any;
    name = "efento";


    constructor(config: any, app: express.Express, db: any, eventHub: events.EventEmitter) {
        super(app, db, eventHub);
        this.db = db;
        this.app = app;
        this.eventHub = eventHub;

        log("PLUGIN", this.name, "LOADED");

        var server = coap.createServer();
        server.on('request', function (req: any, res: any) {
            let requestUrl = req.url.split('/')[1];
            if (requestUrl === 'm') {
                let payload = req.payload;
                var message = proto.Measurements.deserializeBinary(payload);
                var devicepacket = MeasurementManager.logToConsoleDataOfSensor(message);

                if (devicepacket.Owner && devicepacket.Owner.length == 32) {
                    eventHub.emit("device",
                        {
                            apikey: devicepacket.Owner,
                            packet: {
                                id: devicepacket.SerialNumber,
                                data: devicepacket.packet,
                                meta: { method: "efento" }
                            }
                        }
                    )
                }
                res.statusCode = '2.01';
                res.end(''); // put here optional payload
            }
        });

        server.listen();
    }
}