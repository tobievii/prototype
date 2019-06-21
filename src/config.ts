import * as fs from 'fs';
import { log } from "./utils"
import { EventEmitter } from 'events';
import express = require('express');
var mongojs = require('mongojs')
var nodePackage = JSON.parse(fs.readFileSync("../package.json").toString());

export var version = {
    "version": nodePackage.version,
    "description": "prototype"
}

export class Config extends EventEmitter {
    db: any;
    eventhub: any;
    version: any;
    webpushkeys: any;
    configGen: any;
    redis: any;

    constructor(app: express.Express, eventHub: EventEmitter) {
        super();
        this.configGen = this.configGenFunction();
        this.eventhub = eventHub;
        this.version = version;
        this.db = mongojs(this.configGen.mongoConnection, this.configGen.mongoCollections);
        log("VERSION\t" + this.version.version)
    }

    configGenFunction() {
        var defaultconfig = {
            "ssl": false,
            "httpPort": 8080,
            "mongoConnection": "prototype",
            "iotnxtV3Queue": {
                "gateways": []
            },
            "webpushkeys": {
                "publicVapidKey": "BNOtJNzlbDVQ0UBe8jsD676zfnmUTFiBwC8vj5XblDSIBqnNrCdBmwv6T-EMzcdbe8Di56hbZ_1Z5s6uazRuAzA",
                "privateVapidKey": "IclWedYTzNBuMaDHjCjA1B5km-Y3NAxTGbxR7BqhU90"
            }
        }

        try {
            var mainconfig = JSON.parse(fs.readFileSync('../../../iotconfig.json').toString());
            mainconfig.version = version
            mainconfig.mongoCollections = ['packets', 'users', 'states']

            if (!mainconfig.ssl) {
                mainconfig.ssl = defaultconfig.ssl;
            }

            if (mainconfig.ssl == true) {
                mainconfig.sslOptions.cert = fs.readFileSync(mainconfig.sslOptions.certPath)
                mainconfig.sslOptions.key = fs.readFileSync(mainconfig.sslOptions.keyPath)
                if (mainconfig.sslOptions.caPath) {
                    mainconfig.sslOptions.ca = fs.readFileSync(mainconfig.sslOptions.caPath)
                }
            }

            if (!mainconfig.httpPort) {
                mainconfig.httpPort = defaultconfig.httpPort;
            }

            if (!mainconfig.mongoConnection) {
                mainconfig.mongoConnection = defaultconfig.mongoConnection;
            }

            if (!mainconfig.iotnxtV3Queue) {
                mainconfig.iotnxtV3Queue = defaultconfig.iotnxtV3Queue;
            }

            if (!mainconfig.webpushkeys) {
                mainconfig.webpushkeys = defaultconfig.webpushkeys;
            }

            return mainconfig
        } catch (err) {
            log("CONFIG \tFile not found. Using defaults. See /src/config.ts for details.")
            //DEFAULTS
            return defaultconfig
        }
    }
}