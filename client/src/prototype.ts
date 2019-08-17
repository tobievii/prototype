import * as events from "events"
import * as request from "browser-request";

export class PrototypeClient extends events.EventEmitter {

    //ws = new WebSocket('ws://'+location.host);
    apikey: string = "";
    headers: any = {};

    constructor() {
        super();
        console.log(this.constructor.name + "\t Initialized.")

        // this.ws.onopen = () => {
        //     console.log(this.constructor.name+"\t WebSocket connected.")
        //     this.ws.send("proto connect")
        // }

        // this.ws.onmessage = (evt) => {
        //     //console.log(evt.data);
        //     this.emit("data", evt.data);
        // }

        this.account((err, account) => {
            if (err) this.emit("err", err);
            if (account) this.account = account;
        })
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
        request.get("/api/v3/account",
            (err: Error, res: any, body: any) => {
                if (err) cb(err);
                if (body) cb(null, body);
            }
        )
    }
}