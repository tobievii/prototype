
import * as events from "events"
import * as net from "net";
import * as fs from "fs"

import { mqttConnection } from "./mqttConnection"

export var mqttConnections:any = [];

export function init(app: any, db: any, eventHub: events.EventEmitter) {

    var server = net.createServer(function (socket: any) {
        var client = new mqttConnection(socket)
        
        client.on("connect",   (packet)  => { console.log(packet); })
        client.on("subscribe", (packet)  => { console.log(packet); })
        client.on("publish",   (publish) => { 
            console.log(publish); 
            var requestClean:any = {}   

            try {
                requestClean = JSON.parse(publish.payload)
                requestClean.meta = { "User-Agent" : "MQTT", "method" : "publish" }    
                eventHub.emit("device", { apikey: publish.topic, packet: requestClean })
            } catch (err) {
                console.log(err);
            }
            console.log(mqttConnections)
        })
    });

    server.listen(1883);
}   


