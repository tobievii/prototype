import * as fs from 'fs';
import { Webserver } from "./core/webserver"
import { DocumentStore } from "./core/data"
import { Core } from "./core/core"
import * as cluster from "cluster"
import { logger } from './core/log';
import { Package, DBchange } from "./interfaces/interfaces"
import * as repl from "repl";
import { SocketServer } from './core/socketserver';
import { MQTTServer } from "./components/mqttserver/mqtt"


var nodePackage: Package = JSON.parse(fs.readFileSync("../package.json").toString());

logger.log({ message: "process start", data: { name: nodePackage.name, version: nodePackage.version }, level: "info" })

const numCPUs = require('os').cpus().length;

var config = {
    "ssl": false,
    "httpPort": 8080,
    "mongoConnection": 'mongodb://localhost:27017/8bo',
    version: { name: nodePackage.name, version: nodePackage.version, description: nodePackage.description }
}

interface State {
    isMaster: boolean;
    pid: any;
    numCPUs: any;
}

var state: State = {
    isMaster: cluster.isMaster,
    pid: process.pid,
    numCPUs: require('os').cpus().length
}

//console.log(state)



if (cluster.isMaster) {

    logger.log({ message: "cluster isMaster", data: { state }, level: "info" })

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        logger.log({ message: "cluster forking", data: { workernum: i }, level: "info" })

        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.log({ message: "cluster fork died", data: { workerpid: worker.process.pid, signal, code }, level: "warn" })
    });

    setTimeout(() => {
        var replserver = repl.start("");
        // expose state to repl context
        replserver.context.state = state;
    }, 2000)


} else {
    logger.log({ message: "cluster fork active", data: { workerpid: process.pid }, level: "info" })

    var core;
    var webserver;
    var socketserver: SocketServer;
    var mqttserver: MQTTServer;

    var documentstore = new DocumentStore({ mongoConnection: config.mongoConnection });

    documentstore.on("ready", () => {
        // only allow webserver to recieve api calls once db is ready.
        core = new Core({ documentstore, config })
        webserver = new Webserver({ core });
        socketserver = new SocketServer({ server: webserver.server, core });
        mqttserver = new MQTTServer({ core })

        documentstore.on("packets", (data: DBchange) => {
            socketserver.emit("packets", data);
            mqttserver.emit("packets", data);
        })

        webserver.listen();
    });
}


