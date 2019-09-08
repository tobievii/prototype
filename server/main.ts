import * as fs from 'fs';
import { Webserver } from "./core/webserver"
import { DocumentStore } from "./core/data"
import { Core } from "./core/core"
import * as cluster from "cluster"
import { logger } from './shared/log';
import { DBchange, User } from "./shared/interfaces"
import * as repl from "repl";
import { SocketServer } from './core/socketserver';
import { MQTTServer } from "./core/mqtt"
import { cfg } from "./core/config"
import { Migration } from "./utils/migrate"

console.log(cfg.config)

logger.log({ message: "process start", level: "info" })

// todo:
// ssl certs

// todo switch back to cpu length for production
const numCPUs = require('os').cpus().length;
//const numCPUs = 1;

// var config = {
//     "ssl": false,
//     "httpPort": 8080,
//     "mongoConnection": 'mongodb://localhost:27017/8bo',
//     version: { name: nodePackage.name, version: nodePackage.version, description: nodePackage.description }
// }

interface State {
    isMaster: boolean;
    pid: any;
    numCPUs: any;
    workers: cluster.Worker[];
}

var state: State = {
    isMaster: cluster.isMaster,
    pid: process.pid,
    numCPUs: require('os').cpus().length,
    workers: []
}

//console.log(state)



if (cluster.isMaster) {

    logger.log({ message: "cluster isMaster", data: { state }, level: "info" })

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        logger.log({ message: "cluster forking", data: { workernum: i }, level: "info" })
        var worker = cluster.fork();
        state.workers.push(worker);
    }

    cluster.on('message', (worker, message, handle) => {
        logger.log({ message: "cluster message", data: { worker, message, handle }, level: "verbose" })
    });

    cluster.on('exit', (worker, code, signal) => {
        logger.log({ message: "cluster fork died", data: { workerpid: worker.process.pid, signal, code }, level: "warn" })
    });

    process.on('message', (msg) => {
        //process.send(msg);
        logger.log({ message: "master process recv", data: { msg }, level: "verbose" });
    });

    setTimeout(() => {

        // expose state to repl context
        var core;
        var documentstore = new DocumentStore({
            mongoConnection: cfg.config.mongoConnection
        });

        documentstore.on("ready", () => {

            core = new Core({ documentstore, config: cfg.config })

            var replserver = repl.start(">");
            replserver.context.state = state;
            replserver.context.api = core;

            var migration = new Migration({ documentstore })
        });

    }, 2000)


} else {
    logger.log({ message: "cluster fork active", data: { workerpid: process.pid }, level: "info" })

    var core;
    var webserver;
    var socketserver: SocketServer;
    var mqttserver: MQTTServer;

    var documentstore = new DocumentStore({ mongoConnection: cfg.config.mongoConnection });

    process.on('message', (msg) => {
        logger.log({ message: "worker process recv", data: { msg }, level: "verbose" });
        if (process) if (process.send) if (msg) process.send(msg);
    });

    documentstore.on("ready", () => {
        // only allow webserver to recieve api calls once db is ready.
        core = new Core({ documentstore, config: cfg.config })
        webserver = new Webserver({ core, config: cfg.config });
        if (webserver.server) socketserver = new SocketServer({ server: webserver.server, core });
        mqttserver = new MQTTServer({ core })

        // update client that packets has changed
        documentstore.on("packets", (data: DBchange) => {
            if (data.fullDocument) {
                socketserver.emit("packets", data.fullDocument);
                mqttserver.emit("packets", data.fullDocument);
            }
        })

        // update client that packets has changed
        documentstore.on("states", (data: DBchange) => {
            if (data.fullDocument) {
                socketserver.emit("states", data.fullDocument);
                mqttserver.emit("states", data.fullDocument);
            }
        })

        // update client that account has changed
        documentstore.on("users", (data: DBchange) => {
            if (data.fullDocument) {

                socketserver.emit("users", data.fullDocument);
                mqttserver.emit("users", data.fullDocument);
            }
        })

        webserver.listen();
    });
}


