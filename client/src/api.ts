import * as events from "events"
import { request } from "./utils/requestweb"
import { User } from "../../server/core/interfaces"
import { logger } from "../../server/core/log"

import * as io from "socket.io-client"

export class API extends events.EventEmitter {
    uri: string = ""
    headers: any = {};
    apikey: string;
    accountData: User | undefined;
    socket: any;

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
    account(cb?: Function) {
        request.get(this.uri + "/api/v3/account",
            { headers: this.headers, json: true },
            (err: Error, res: any, body: any) => {
                if (err) if (cb) cb(err);
                if (body) {
                    console.log(body);
                    if (body.apikey) {
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
                console.log(data);
            });

            // Receive data:
            this.socket.on("packets", data => {
                console.log(data);
            });

            // Receive data on our users data that changes.. essentially our account details.
            // each user only has one entry into "users" db
            this.socket.on("users", data => {
                this.emit("account", data);
            });
        });
    }

    signin(email: string, pass: any, cb: Function) {
        request.post(this.uri + "/signin", { json: { email, pass } }, (err: Error, res: any, body: any) => {
            if (err) cb(err);
            if (body) {
                if (body.err) { cb(new Error(body.err)); return; }
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

}




export var api = new API()