import * as events from "events"

export class API extends events.EventEmitter {
    uri: string = ""
    constructor() {
        super();
        console.log("API initialized")
    }

    register(options: { email: string, pass: string }, cb: (err: any, result?: any) => void) {
        fetch("/api/v3/admin/register", {
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(options)
        }).then(response => response.json()).then(resp => {
            if (resp.err) {
                cb(resp);
                return;
            }
            cb(undefined, resp);
        }).catch((err) => {
            console.error(err.toString());
            cb(err);
        });
    }



}


export var api = new API()