// http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718037
// https://docs.solace.com/MQTT-311-Prtl-Conformance-Spec/MQTT%20Control%20Packet%20format.htm#_Toc430864887

import { EventEmitter } from "events"
import * as net from "net";

import * as _ from "lodash"
import { logger } from "../shared/log"
import { generateDifficult } from "../utils/utils"
import { Core } from "./core"
import { DBchange, CorePacket } from "../shared/interfaces";

export class MQTTServer extends EventEmitter {
    serversMem: any[] = [];
    db: any;
    app: any;
    name = "MQTT";

    mqttConnections: any = [];
    isCluster: boolean = false;
    ev: any;
    clustersubs: string[] = [];

    constructor(options: { core: Core }) {
        super();

        var server = net.createServer((socket: any) => {
            var client = new mqttConnection({ socket, core: options.core })

            client.on("connect", (data) => {
                logger.log({ message: "mqtt client conn", data: { data }, level: "verbose" })
                this.mqttConnections.push(client);
            })

            client.on("subscribe", (packet) => {
                if (client.subscriptions.includes(packet.subscribe) == false) {
                    logger.log({ message: "mqtt subscr", data: { sub: packet.subscribe }, level: "verbose" })
                    client.subscriptions.push(packet.subscribe)
                }
            })

            // client.on("publish", (publish) => {
            //     var requestClean: any = {}

            //     // error catching..

            //     try {
            //         requestClean = JSON.parse(publish.payload)
            //         if (requestClean.data == undefined || requestClean.id == undefined) {
            //             logger.log({ message: "mqtt data/id parameter missing", data: {}, level: "warn" })
            //         } else {
            //             logger.log({ message: "mqtt publish recv", data: {}, level: "info" })
            //             requestClean.meta = { "User-Agent": "MQTT", "method": "publish", "socketUuid": client.uuid }
            //             //this.emit("device", { apikey: publish.topic, packet: requestClean }) // this now needs to be processed and saved to db.
            //             options.core.datapost({ user: client.user, packet: requestClean })

            //         }
            //     } catch (err) {
            //         logger.log({ message: "mqtt error", data: { err }, level: "error" });
            //     }
            // })

            client.on("error", (err: any) => {
                logger.log({ message: "mqtt error", data: { err }, level: "error" });
            })

            client.on("ping", () => { })
        });

        server.listen(1883);

        this.on("packets", (packets) => {
            this.handlePacket(packets);
        })

    }

    handlePacket(packet: CorePacket) {
        if (!packet.id) { return; }
        if (!packet.apikey) { return; }

        for (var mqttConnection of this.mqttConnections) {
            for (var sub of mqttConnection.subscriptions) {
                if ((sub == packet.apikey) || (sub == packet.apikey + "|" + packet.id)) {

                    //var temp = _.clone(packet);

                    // delete temp["meta"]
                    // delete temp.timestamp
                    // if (temp.err != undefined) {
                    //     if (temp.err == "") {
                    //         delete temp.err
                    //     }
                    // }

                    if (mqttConnection.connected) {
                        var sendit = true;

                        // // check if this is not the same socket that sent the packet, if so then we do not echo it back.
                        // if (_.has(packet, "payload.meta.socketUuid")) {
                        //     if (packet.payload.meta.socketUuid == mqttConnection.uuid) {
                        //         sendit = false;
                        //     }
                        // }

                        if (sendit) {
                            logger.log({ message: "mqtt handlePacket", data: { apikey: packet.apikey, packet: packet }, level: "verbose" });
                            mqttConnection.publish(packet.apikey, JSON.stringify(packet))
                        }
                    }
                }
            }
        }
    }

}







var mqttpacket = require('mqtt-packet')

export class mqttConnection extends EventEmitter {
    core: Core;
    socket: net.Socket;
    apikey: string = "";
    subscriptions: any = [];
    connected: Boolean = false;
    uuid: string = "";
    data: Buffer;
    packetCount: number = 0;
    parser: any;
    user: any;

    constructor(options: { socket: net.Socket, core: Core }) {
        super()

        this.socket = options.socket;
        this.core = options.core;

        var opts = { protocolVersion: 4 } // default is 4. Usually, opts is a connect packet
        this.parser = mqttpacket.parser(opts);

        this.data = Buffer.from("");
        this.uuid = generateDifficult(32);

        this.connected = true;

        this.parser.on("packet", (packet: any) => {

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



                        this.core.user({ apikey: apikey[1] }, (err, user) => {
                            if (err) {
                                //disconnect wrong username/pass
                                this.socket.write(mqttpacket.generate({ cmd: "connack", returnCode: 4 }))
                                return;
                            }

                            if (user) {
                                this.user = user;
                                this.apikey = apikey[1];
                                this.emit("connect", { apikey: this.apikey })

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
                ///////////


                //this.emit("publish", packet);





                var requestClean: any = {}

                // error catching..

                try {
                    requestClean = JSON.parse(packet.payload)
                    if (requestClean.data == undefined || requestClean.id == undefined) {
                        logger.log({ message: "mqtt data/id parameter missing", data: {}, level: "warn" })
                    } else {
                        logger.log({ message: "mqtt publish recv", data: {}, level: "info" })
                        requestClean.meta = { "User-Agent": "MQTT", "method": "publish", "socketUuid": "..." }
                        //this.emit("device", { apikey: publish.topic, packet: requestClean }) // this now needs to be processed and saved to db.
                        options.core.datapost({ user: this.user, packet: requestClean }, (err, result) => {
                            if (packet.qos > 0) {
                                this.socket.write(mqttpacket.generate({
                                    cmd: 'puback',
                                    messageId: packet.messageId
                                }))
                            }
                        })

                    }
                } catch (err) {
                    logger.log({ message: "mqtt error", data: { err }, level: "error" });
                }







                /////////////
            }
        })

        this.socket.on("close", (err) => {
            //this.connected = false;
            //this.emit("close", err);
        })

        this.socket.on("connect", () => { })
        this.socket.on("data", (chunk) => { this.parser.parse(chunk); })
        this.socket.on("drain", () => { })
        this.socket.on("end", () => { });
        this.socket.on("error", (err) => { })
        this.socket.on("timeout", () => { })
        this.socket.on("lookup", (err, address, family, host) => { })
    }

    publish = (topic: string, data: any) => {
        if (typeof data != "string") {
            data = JSON.stringify(data)
        }

        try {
            this.socket.write(mqttpacket.generate({
                cmd: 'publish',
                topic,
                payload: Buffer.from(data)
            }))
        } catch (err) {
            logger.log({ message: "mqtt publish", data: { err }, level: "error" });
        }

    }

}
