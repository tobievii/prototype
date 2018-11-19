
import * as events from "events"
import * as net from "net";
import * as fs from "fs"
import { mqttConnection } from "./mqttConnection"

import * as accounts from "../../accounts"

export var mqttConnections:any = [];

export function handlePacket(db:any, packet:any, cb:any) {
    //console.log("mqtt handle packet")
    //console.log(packet)
    for (var c in mqttConnections) {
        //mqttConnections[c].publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", packet)
        if (mqttConnections[c].apikey == packet.apikey) {
            mqttConnections[c].publish(packet.apikey, JSON.stringify(packet))
        }    
    }
}

export function init(app: any, db: any, eventHub: events.EventEmitter) {
    console.log("mqtt plugin")

    var server = net.createServer(function (socket: any) {
        var client = new mqttConnection(socket)
        client.on("connect",   (data)  => { 
            mqttConnections.push(client);
            //console.log("---------=-=-=")
            //console.log(data)
            
            // setInterval( ()=>{
            //      client.publish("glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9", JSON.stringify({id:"testDevice",data:{a:Math.random()}}))
            // },2000)

        })
        client.on("subscribe", (packet)  => { console.log(packet); })

        client.on("publish",   (publish) => { 
            //console.log("mqtt incoming publish"); 
            var requestClean:any = {}   

            try {
                requestClean = JSON.parse(publish.payload)
                requestClean.meta = { "User-Agent" : "MQTT", "method" : "publish" }    
                eventHub.emit("device", { apikey: publish.topic, packet: requestClean })
            } catch (err) {
                console.log(err);
            }
            
        })

        client.on("error", (err)=>{
            console.log(err);
        })

        client.on("close", (err)=>{

        })
    });

    server.listen(1883);
}   



export function mqttUpdateDevice(db:any, packet:any, cb:any) {
    // console.log("mqtt update device")
    // console.log(packet)

}

