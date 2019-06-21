import * as request from "request"
import { EventEmitter } from "events";

export interface Packet {
    id:string;
    data:object;
}

export class Prototype extends EventEmitter{
    uri:string = "http://localhost:8080" // default
    apikey:string = "";
    headers:any = {};
    id = undefined;

    constructor(options?:any) {
        super();
        if (options) {
            if (options.uri) { this.uri = options.uri; }
            if (options.apikey) { 
                this.apikey = options.apikey; 
                this.rebuildHeader(); 
            }


            if (options.protocol) {
                if (options.protocol == "socketio") {
                    //connect over socket.io
                    this.protocolSocketio();
                }

                if (options.protocol == "mqtt") {
                    //connect over mqtt
                    this.protocolMqtt();
                }
            }

            if (options.id) { this.id = options.id};
        } 
    }

    /*
        registers a new account
    */
    register(email:string, pass:string, cb:Function) {
        request.post(this.uri+"/api/v3/admin/register", { json: { email, pass} }, (err,res,body)=>{
            if (err) cb(err);
            if (body) { 
                if (body.error) {cb(new Error(body.error)); return; }
                if (body.account.apikey) { 
                    this.apikey = body.account.apikey
                    this.rebuildHeader();
                    cb(null,body); 
                }    
                
            }
        });
    }

    // takes the apikey and generates the base64 auth header
    rebuildHeader () {
        this.headers = { 
            Authorization: "Basic " + Buffer.from("api:key-" + this.apikey).toString("base64"), 
            "Content-Type": "application/json" 
        }
    }

    // gets our latest account details
    account(cb:Function) {
        request.get(this.uri+"/api/v3/account", 
            { headers: this.headers, json:true },
            (err:Error, res:any, body:any) => {
                    if (err) cb(err);
                    if (body) cb(null,body);
            }
        )
    }

    signin(email:string, pass:any, cb:Function) {
        request.post(this.uri+"/signIn", {json:{email,pass}}, (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) { 
                if (body.error) { cb(new Error(body.error)); return; }
                if (body.signedin == true) cb(null,body);}
        })
    }

    version(cb:Function) {
        request.get(this.uri+"/api/v3/version", {json:true}, (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    post(packet:Packet, cb:Function) {
        request.post(this.uri+"/api/v3/data/post", {headers:this.headers,json:packet}, (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) { 
                if (body.result == "success") { cb(null, body); return; } 
                cb(body);
            }
        })
    }

    // view state of a device by id
    view(id:string, cb:Function) {
        request.post(this.uri+"/api/v3/view", 
        {headers:this.headers,json:{id}}, 
        (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    /*
        retrieve device packet history
    */
    packets(id:string, cb:Function) {
        request.post(this.uri+"/api/v3/packets", 
        {headers:this.headers,json:{id}}, 
        (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    /*  
        retrieve a single device state in detail.
    */

    state(id:string, cb:Function) {
        request.post(this.uri+"/api/v3/state", 
        {headers:this.headers,json:{id}}, 
        (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    /*
        provides all device states in an array
    */

    states(cb:Function) {
        request.get(this.uri+"/api/v3/states", 
        {headers:this.headers,json:true}, 
        (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    /*
        deletes a device/state. Device history is not deleted.
    */
    delete(id:string, cb:Function) {
        request.post(this.uri+"/api/v3/state/delete", 
        {headers:this.headers,json:{id}}, 
        (err:Error, res:any, body:any)=>{
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
        var socket = require("socket.io-client")(this.uri, { transports: ['websocket'] })
        socket.on("connect", ()=>{
            this.emit("connect");
            if (this.apikey == "") { console.error("apikey blank")}
            if (this.id) {
                socket.emit("join", this.apikey+"|"+this.id);
            } else {
                socket.emit("join", this.apikey);
            }
            

            socket.on("post", (data:any) =>{
                this.emit("data", data);
            })
        })
    }

    protocolMqtt() {
        var mqtt = require('mqtt');
        var client = mqtt.connect('mqtt://localhost', { username: "api", password: "key-" + this.apikey });
        client.on("connect", ()=>{
            this.emit("connect");
            if (this.id) {
                client.subscribe(this.apikey+"|"+this.id);
            } else {
                client.subscribe(this.apikey);
            }
            
            client.on("message", (topic:string, message:any)=>{
                this.emit("data", JSON.parse(message.toString()))
            })
        })
        
    }

}