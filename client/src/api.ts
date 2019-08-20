import * as events from "events"
import { request } from "./utils/requestweb"
import { User, CorePacket } from "../../server/core/interfaces"
import { logger } from "../../server/core/log"

import * as io from "socket.io-client"


export class API extends events.EventEmitter {
    uri: string = ""
    headers: any = {};
    apikey: string;
    accountData: User | undefined;
    socket: any;

    data: any = {
        account: {},
        states: [],
        packets: []
    }

    constructor() {
        super();
        logger.log({ message: "API initialized", level: "verbose" })
    }

    register(options: { email: string, pass: string }, cb: (err: any, result?: any) => void) {
        request.post(this.uri + "/api/v3/admin/register",
            { json: { email: options.email, pass: options.pass } },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    if (body.error) { cb(new Error(body.error)); return; }
                    if (body.account.apikey) {
                        this.apikey = body.account.apikey
                        this.rebuildHeader();
                        this.connectSocket();

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
    account = (cb?: Function) => {
        request.get(this.uri + "/api/v3/account",
            { headers: this.headers, json: true },
            (err: Error, res: any, body: any) => {
                if (err) if (cb) cb(err);
                if (body) {
                    if (body.apikey) {
                        this.data.account = body;
                        //this.data.account = body;
                        this.apikey = body.apikey;
                        if (this.socket == undefined) this.connectSocket();
                    }
                    if (cb) cb(null, body);
                }
            }
        )
    }

    connectSocket() {
        this.socket = io(undefined, { transports: ['websocket'] });

        this.socket.on("connect", (sock) => {
            console.log("connected.");
            this.socket.emit("join", this.apikey); // your api key
            // or subscribe to a specific device: 
            // socket.emit("join", "0aotj1uetsqfwdrui9fqqsj02kr7wsrw|yourdevice001");

            // Receive data:
            this.socket.on("post", data => {
                //console.log(data);
            });

            // Receive data:
            this.socket.on("packets", data => {
                console.log("packet event:")
                console.log(data);
            });

            // Receive data on our users data that changes.. essentially our account details.
            // each user only has one entry into "users" db
            this.socket.on("users", data => {
                this.emit("account", data);
            });

            this.socket.on("states", data => {
                // console.log("states event:");

                let found: boolean = false;
                for (var s in this.data.states) {
                    if (this.data.states[s].key == data.key) {
                        logger.log({ message: "recieved new device state", data: data, level: "verbose" })
                        this.data.states[s] = data; //new data
                        found = true;
                    }
                }

                if (found == false) {
                    this.data.states.push(data);
                }

                // let the app know:
                this.emit("states", this.data.states);
            })
        });
    }

    signin(email: string, pass: any, cb: Function) {
        request.post(this.uri + "/signin", { json: { email, pass } }, (err: Error, res: any, body: any) => {
            if (err) cb(err);
            if (body) {
                if (body.err) { cb(new Error(body.err)); return; }
                if (body.error) { cb(new Error(body.error)); return; }
                if (body.signedin == true) {
                    cb(null, body);
                }
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

    post(packet: CorePacket, cb?: (err: Error, result?: any) => void) {
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

    states = (cb: (err: Error, states?: object) => void) => {
        request.get(this.uri + "/api/v3/states",
            { json: true },
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) {
                    this.data.states = body;
                    cb(null, body);
                }
            })
    }

    /*
        deletes a device/state. Device history is not deleted.
    */
    delete(id: string, cb: Function) {
        request.post(this.uri + "/api/v3/state/delete",
            { json: { id } },
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



    ////////////////////// WEB API

    location = (location) => {
        this.emit("location", location);
    }

}

var apiinstance = new API()

const globalAny: any = global;
globalAny.api = apiinstance


export var api = apiinstance
//window.api = api;