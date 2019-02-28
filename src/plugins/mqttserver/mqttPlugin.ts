
import * as events from "events"
import * as net from "net";
import * as fs from "fs"
import { mqttConnection } from "./mqttConnection"

import * as accounts from "../../accounts"
import * as _ from "lodash"
export var mqttConnections: any = [];

import { log } from "../../utils"

export const name = "MQTT"

export function handlePacket(db: any, packet: any, cb: any) {
    //log("mqtt handle packet")
    //log(packet)

    for (var c in mqttConnections) {
        //mqttConnections[c].publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", packet)

        for (var sub of mqttConnections[c].subscriptions) {
            if (sub == packet.apikey) {

                var temp = _.clone(packet.payload);
                delete temp["meta"]
                delete temp.timestamp
                if (temp.err != undefined) {
                    if (temp.err == "") {
                        delete temp.err
                    }
                }

                if (mqttConnections[c].connected) {
                    mqttConnections[c].publish(packet.apikey, JSON.stringify(temp))
                }

            }
        }

        // if (mqttConnections[c].apikey == packet.apikey) {

        // }
    }

}

export function init(app: any, db: any, eventHub: events.EventEmitter) {

    var server = net.createServer(function (socket: any) {
        var client = new mqttConnection(socket)
        client.on("connect", (data) => {
            mqttConnections.push(client);
            //log("---------=-=-=")
            //log(data)

            // setInterval( ()=>{
            //      client.publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", JSON.stringify({id:"testDevice",data:{a:Math.random()}}))
            // },2000)

        })
        client.on("subscribe", (packet) => {
            client.subscriptions.push(packet.subscribe)
        })

        client.on("publish", (publish) => {
            //log("mqtt incoming publish"); 
            var requestClean: any = {}

            try {
                requestClean = JSON.parse(publish.payload)
                requestClean.meta = { "User-Agent": "MQTT", "method": "publish" }
                eventHub.emit("device", { apikey: publish.topic, packet: requestClean })
            } catch (err) {
                log(err);
            }

        })

        client.on("error", (err) => {
            log(err);
        })

        //client.on("close", (err) => { log("MQTT CLIENT CLOSED") })
    });

    server.listen(1883);
}



export function mqttUpdateDevice(db: any, packet: any, cb: any) {
    // log("mqtt update device")
    // log(packet)

}

