import * as request from "request"
import { EventEmitter } from "events";

import { iotnxt } from "./api_prototype_iotnxt"


export interface Packet {
    id: string;
    data: object;
}

export interface Options {
    host?: string;
    apikey?: string;
    protocol?: string;
    id?: string | any;
    https?: boolean;
    port?: number;
}

export class Prototype extends EventEmitter {
    uri: string = ""
    apikey: string = "";
    headers: any = {};
    id = undefined;
    socketclient: any = undefined;
    mqttclient: any = undefined;
    protocol = "http";
    plugins: any = {};
    host: string = "localhost";

    https: boolean = false;
    httpprot = "http";
    port: number | undefined = undefined;

    constructor(options?: Options) {
        super();
        if (options) {
            //if (options.uri) { this.protocol+"://"+this.host = options.uri; }
            if (options.host) { this.host = options.host }
            if (options.https) { this.https = options.https }

            if (this.https) {
                this.httpprot = "https";
                this.protocol = "https";
            } else {
                this.httpprot = "http"
                this.protocol = "http";
            }

            if (options.apikey) {
                this.apikey = options.apikey;
                this.rebuildHeader();
            }

            if (options.port) { this.port = options.port }

            if (this.port) {
                if ([80, 443].indexOf(this.port) == -1) {
                    this.uri = this.httpprot + "://" + this.host + ":" + this.port;
                } else {
                    this.uri = this.httpprot + "://" + this.host;
                }
            } else {
                this.uri = this.httpprot + "://" + this.host;
            }



            if (options.protocol) {
                this.protocol = options.protocol;
                if (options.protocol == "socketio") {
                    //connect over socket.io
                    this.protocolSocketio();
                }

                if (options.protocol == "mqtt") {
                    //connect over mqtt
                    this.protocolMqtt();
                }
            }

            if (options.id) { this.id = options.id };
        }


        this.plugins.iotnxt = new iotnxt(this);

    }

    /*
        registers a new account
    */
    register(email: string, pass: string, cb: Function) {
        //console.log(this.uri+"/api/v3/admin/register")
        //this.uri = "https://prototype.dev.iotnxt.io"
        request.post(this.uri + "/api/v3/admin/register", { json: { email, pass } }, (err, res, body) => {
            if (err) cb(err);
            if (body) {
                if (body.error) { cb(new Error(body.error)); return; }
                if (body.account.apikey) {
                    this.apikey = body.account.apikey
                    this.rebuildHeader();
                    cb(null, body);
                }

            }
        });
    }

    // takes the apikey and generates the base64 auth header
    rebuildHeader() {
        this.headers = {
            Authorization: "Basic " + Buffer.from("api:key-" + this.apikey).toString("base64"),
            "Content-Type": "application/json"
        }
    }

    // gets our latest account details
    account(cb: Function) {
        request.get(this.uri + "/api/v3/account",
            { headers: this.headers, json: true },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) cb(null, body);
            }
        )
    }

    signin(email: string, pass: any, cb: Function) {
        request.post(this.uri + "/signIn", { json: { email, pass } }, (err: Error, res: any, body: any) => {
            if (err) cb(err);
            if (body) {
                if (body.error) { cb(new Error(body.error)); return; }
                if (body.signedin == true) cb(null, body);
            }
        })
    }

    version(cb: Function) {
        request.get(this.uri + "/api/v3/version", { json: true }, (err: Error, res: any, body: any) => {
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    post(packet: Packet, cb?: Function) {
        if ((this.protocol == "http") || (this.protocol == "https")) {
            request.post(this.uri + "/api/v3/data/post", { headers: this.headers, json: packet }, (err: Error, res: any, body: any) => {
                if (err) if (cb) cb(err);
                if (body) {
                    if (body.result == "success") {
                        if (cb) cb(null, body);
                        return;
                    }
                    if (cb) cb(body);
                }
            })
        }

        if (this.protocol == "mqtt") {
            if (this.mqttclient) {
                this.mqttclient.publish(this.apikey, JSON.stringify(packet), cb)
            }
        }

        if (this.protocol == "socketio") {
            if (this.socketclient) {
                this.socketclient.emit("post", packet)

                //workaround as emit post callback does not fire
                setTimeout(() => {
                    if (cb) cb()
                }, 50)

            }
        }

    }

    // view state of a device by id
    view(id: string, cb: Function) {
        request.post(this.uri + "/api/v3/view",
            { headers: this.headers, json: { id } },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    cb(null, body);
                }
            })
    }

    /*
        retrieve device packet history
    */
    packets(id: string, cb: Function) {
        request.post(this.uri + "/api/v3/packets",
            { headers: this.headers, json: { id } },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    cb(null, body);
                }
            })
    }

    /*  
        retrieve a single device state in detail.
    */

    state(id: string, cb: Function) {
        request.post(this.uri + "/api/v3/state",
            { headers: this.headers, json: { id } },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    cb(null, body);
                }
            })
    }

    /*
        provides all device states in an array
    */

    states(cb: Function) {
        request.get(this.uri + "/api/v3/states",
            { headers: this.headers, json: true },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    cb(null, body);
                }
            })
    }

    /*
        deletes a device/state. Device history is not deleted.
    */
    delete(id: string, cb: Function) {
        request.post(this.uri + "/api/v3/state/delete",
            { headers: this.headers, json: { id } },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    if (body.ok == 1) {
                        cb(null, body);
                    } else {
                        cb(body);
                    }
                }
            })
    }

    protocolSocketio() {
        var socketclient = require("socket.io-client")(this.uri, { transports: ['websocket'] })
        this.socketclient = socketclient;
        socketclient.on("connect", () => {

            if (this.apikey == "") { console.error("apikey blank") }
            if (this.id) {
                socketclient.emit("join", this.apikey + "|" + this.id);
                this.emit("connect");
            } else {
                socketclient.emit("join", this.apikey);
                this.emit("connect");
            }


            socketclient.on("post", (data: any) => {
                this.emit("data", data);
            })
        })
    }

    protocolMqtt() {
        var mqtt = require('mqtt');
        var mqttclient = mqtt.connect('mqtt://' + this.host, { username: "api", password: "key-" + this.apikey });
        this.mqttclient = mqttclient;

        mqttclient.on("connect", () => {
            this.emit("connect");
            if (this.id) {
                mqttclient.subscribe(this.apikey + "|" + this.id);
            } else {
                mqttclient.subscribe(this.apikey);
            }

            mqttclient.on("message", (topic: string, message: any) => {
                this.emit("data", JSON.parse(message.toString()))
            })
        })

    }

    /*
     Disconnects from server
    */

    disconnect() {
        if (this.protocol == "mqtt") {
            if (this.mqttclient) this.mqttclient.end();
        }
        if (this.protocol == "socketio") {
            if (this.socketclient) this.socketclient.disconnect();
        }
    }

}