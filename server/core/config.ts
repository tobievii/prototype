import * as fs from 'fs';
import { EventEmitter } from 'events';
import { logger } from "../shared/log"
import { Package, DBchange, User, ConfigFile } from "../shared/interfaces"



export class Config extends EventEmitter {
    filepath:string =  '../../../iotconfig.json';
    config : ConfigFile = {
        ssl: false,
        httpPort: 8080,
        mongoConnection : "prototype"
    };
    package: any|Package = {}

    constructor(options?:any) {
        super();
        if (options) { this.filepath = options.filepath }
        this.loadnodepkg();
        this.loadconfig();
        this.config.version = { name: this.package.name, 
            version: this.package.version, 
            description: this.package.description }

        this.loadsslkeys();
    }

    loadconfig() {
        try {
            var mainconfig = JSON.parse(fs.readFileSync(this.filepath).toString());
            this.config = mainconfig;
        }
        catch (err) {
            logger.log({message:"config "+err.toString(), level:"error"})
        }
    }

    loadnodepkg() {
        try {
            var nodePackage: Package = JSON.parse(fs.readFileSync("../package.json").toString());
            this.package = nodePackage;

        } catch (err) {
            logger.log({message:"config "+err.toString(), level:"error"})
        }
    }

    loadsslkeys() {
        if (this.config.ssl == true) {
            this.config.sslOptions.cert = fs.readFileSync(this.config.sslOptions.certPath)
            this.config.sslOptions.key = fs.readFileSync(this.config.sslOptions.keyPath)
            if (this.config.sslOptions.caPath) {
                this.config.sslOptions.ca = fs.readFileSync(this.config.sslOptions.caPath)
            }
        }
    }

    // configGenFunction() {
    //     var defaultconfig = {
    //         "ssl": false,
    //         "httpPort": 8080,
    //         "mongoConnection": "prototype",
    //         "iotnxtV3Queue": {
    //             "gateways": []
    //         },
    //         "webpushkeys": {
    //             "publicVapidKey": "BNOtJNzlbDVQ0UBe8jsD676zfnmUTFiBwC8vj5XblDSIBqnNrCdBmwv6T-EMzcdbe8Di56hbZ_1Z5s6uazRuAzA",
    //             "privateVapidKey": "IclWedYTzNBuMaDHjCjA1B5km-Y3NAxTGbxR7BqhU90"
    //         }
    //     }

    //     try {
    //         var mainconfig = JSON.parse(fs.readFileSync('../../../iotconfig.json').toString());
    //         mainconfig.version = version
    //         mainconfig.mongoCollections = ['packets', 'users', 'states']

    //         if (!mainconfig.ssl) {
    //             mainconfig.ssl = defaultconfig.ssl;
    //         }

    //         if (mainconfig.ssl == true) {
    //             mainconfig.sslOptions.cert = fs.readFileSync(mainconfig.sslOptions.certPath)
    //             mainconfig.sslOptions.key = fs.readFileSync(mainconfig.sslOptions.keyPath)
    //             if (mainconfig.sslOptions.caPath) {
    //                 mainconfig.sslOptions.ca = fs.readFileSync(mainconfig.sslOptions.caPath)
    //             }
    //         }

    //         if (!mainconfig.httpPort) {
    //             mainconfig.httpPort = defaultconfig.httpPort;
    //         }

    //         if (!mainconfig.mongoConnection) {
    //             mainconfig.mongoConnection = defaultconfig.mongoConnection;
    //         }

    //         if (!mainconfig.iotnxtV3Queue) {
    //             mainconfig.iotnxtV3Queue = defaultconfig.iotnxtV3Queue;
    //         }

    //         if (!mainconfig.webpushkeys) {
    //             mainconfig.webpushkeys = defaultconfig.webpushkeys;
    //         }

    //         return mainconfig
    //     } catch (err) {
    //         log("CONFIG \tFile not found. Using defaults. See /src/config.ts for details.")
    //         //DEFAULTS
    //         return defaultconfig
    //     }
    // }
}


export var cfg = new Config()