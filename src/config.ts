import * as fs from 'fs';

import { log } from "./utils"

var nodePackage = JSON.parse(fs.readFileSync("../package.json").toString());

export var version = {
    "version": nodePackage.version,
    "description": "prototype"
}

log("VERSION\t" + version.version)

export var webpushkeys: any = () => {
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

export var configGen: any = () => {
    try {
        var mainconfig = JSON.parse(fs.readFileSync('../../../iotconfig.json').toString());
        mainconfig.version = version
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
            },
            version: version
        }
        return defaultconfig
    }
}