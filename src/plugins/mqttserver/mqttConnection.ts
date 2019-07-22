// ROUAN VAN DER ENDE

// http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718037
// https://docs.solace.com/MQTT-311-Prtl-Conformance-Spec/MQTT%20Control%20Packet%20format.htm#_Toc430864887

import { EventEmitter } from "events";
import * as net from "net"
import * as accounts from "../../accounts"

import { log, generateDifficult } from "../../utils"

var mqttpacket = require('mqtt-packet')

export class mqttConnection extends EventEmitter {
    socket: net.Socket;
    apikey: string = "";
    subscriptions: any = [];
    connected: Boolean = false;
    uuid: string = "";
    data: Buffer;
    packetCount: number = 0;
    parser: any;

    constructor(socket: net.Socket) {
        super()
        var opts = { protocolVersion: 4 } // default is 4. Usually, opts is a connect packet
        this.parser = mqttpacket.parser(opts);

        this.data = Buffer.from("");
        this.uuid = generateDifficult(32);
        this.socket = socket;
        this.connected = true;

        this.parser.on("packet", (packet: any) => {
            console.log(packet)
            if (packet.cmd == "connect") {
                /*
                0x00 Connection Accepted
                0x01 Connection Refused, unacceptable protocol version
                0x02 Connection Refused, identifier rejected
                0x03 Connection Refused, Server unavailable
                0x04 Connection Refused, bad user name or password
                0x05 Connection Refused, not authorized
                */

                // check authentication
                if (packet.username != "api") {
                    //disconnect wrong username/pass
                    this.socket.write(mqttpacket.generate({ cmd: "connack", returnCode: 4 }))
                    return;
                }

                if (packet.password) {
                    var apikey = packet.password.toString().split("-");


                    // error check
                    if ((apikey.length != 2) || (apikey[0] != "key")) {
                        //disconnect wrong username/pass
                        this.socket.write(mqttpacket.generate({ cmd: "connack", returnCode: 4 }))
                        return;
                    }

                    // looks okay, check db
                    if ((apikey[0] == "key") && (apikey.length == 2)) {

                        accounts.checkApiKey(apikey[1], (err: Error, result: any) => {
                            if (err) {
                                //disconnect wrong username/pass
                                this.socket.write(mqttpacket.generate({ cmd: "connack", returnCode: 4 }))
                                return;
                            }

                            if (result) {
                                this.apikey = apikey[1];
                                this.emit("connect", { apikey })

                                this.socket.write(mqttpacket.generate({
                                    cmd: 'connack',
                                    returnCode: 0
                                }));
                            }
                        })


                    }

                }
            }

            if (packet.cmd == "subscribe") {

                // todo:
                // check subscription
                for (var sub of packet.subscriptions) {
                    this.emit("subscribe", { subscribe: sub.topic })
                }

                this.socket.write(mqttpacket.generate({
                    cmd: 'suback',
                    messageId: packet.messageId,
                    granted: [0]
                }));
            }

            if (packet.cmd == "publish") {
                if (packet.qos > 0) {
                    this.socket.write(mqttpacket.generate({
                        cmd: 'puback',
                        messageId: packet.messageId
                    }))
                }
                this.emit("publish", packet);
            }
        })

        socket.on("close", (err) => {
            //this.connected = false;
            //this.emit("close", err);
        })

        socket.on("connect", () => {
            console.log("connect");
        })

        socket.on("data", (chunk) => {
            //console.log("data");
            //console.log(chunk.toString("hex"))
            //this.data = Buffer.concat([this.data, chunk])
            //this.handleData();
            this.parser.parse(chunk);
        })

        socket.on("drain", () => {
            console.log("drain");
        })

        socket.on("end", () => {
            console.log("end");
            //this.handleData();
        });

        socket.on("error", (err) => {
            console.log("error");
        })

        socket.on("timeout", () => { console.log("timeout"); })

        socket.on("lookup", (err, address, family, host) => {
            console.log("lookup");
        })

    }

    publish = (topic: string, data: any) => {
        if (typeof data != "string") {
            data = JSON.stringify(data)
        }

        try {
            this.socket.write(mqttpacket.generate({
                cmd: 'publish',
                topic,
                payload: new Buffer(data)
            }))
        } catch (err) {
            log(err);
        }

    }

}
