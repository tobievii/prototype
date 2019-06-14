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
        this.initialiseValues();
        this.eventhub = eventHub;
        this.version = version;

        log("VERSION\t" + this.version.version)
        this.webpushkeys = this.webpushkeysfunction();
    }

    async initialiseValues() {
        this.configGen = this.configGenFunction();
        this.db = mongojs(this.configGen.mongoConnection, this.configGen.mongoCollections)
        this.redis = await this.getRedis();
    }

    getRedis() {
        return new Promise<any>(resolve => {
            this.db.plugins_admin.findOne({ settings: "redis" }, (err: Error, result: any) => {
                this.redis = result;
                this.eventhub.emit("config", this)
                if (err || result == null) { log("NO REDIS SETTINGS IN DB") }
                resolve(result);
            })
        });
    }

    webpushkeysfunction() {
        var webpushkeys: any;
        try {
            webpushkeys = JSON.parse(fs.readFileSync("../../config/webpushkeys.json").toString());
        } catch (err) {
            log("WEB PUSH KEYS File not found. See /src/config.ts for details.");
            webpushkeys = {
                publicVapidKey: "BNOtJNzlbDVQ0UBe8jsD676zfnmUTFiBwC8vj5XblDSIBqnNrCdBmwv6T-EMzcdbe8Di56hbZ_1Z5s6uazRuAzA",
                privateVapidKey: "IclWedYTzNBuMaDHjCjA1B5km-Y3NAxTGbxR7BqhU90"
            }
        }
        return webpushkeys;
    }

    configGenFunction() {
        try {
            var mainconfig = JSON.parse(fs.readFileSync('../../../iotconfig.json').toString());
            mainconfig.version = this.version
            mainconfig.mongoCollections = ['packets', 'users', 'states']

            if (mainconfig.ssl == true) {
                mainconfig.sslOptions.cert = fs.readFileSync(mainconfig.sslOptions.certPath)
                mainconfig.sslOptions.key = fs.readFileSync(mainconfig.sslOptions.keyPath)
                if (mainconfig.sslOptions.caPath) {
                    mainconfig.sslOptions.ca = fs.readFileSync(mainconfig.sslOptions.caPath)
                }

            }

            return mainconfig
        } catch (err) {
            log("CONFIG \tFile not found. Using defaults. See /src/config.ts for details.")
            //DEFAULTS
            var defaultconfig = {
                "ssl": false,
                "httpPort": 8080,
                "mongoConnection": "prototype",
                "iotnxtV3Queue": {
                    "gateways": []
                }
            }
            return defaultconfig
        }
    }
}