import * as request from "request"

export interface Packet {
    id:string;
    data:object;
}

export class Prototype {
    uri:string = "http://localhost:8080" // default
    apikey:string = "";
    headers:any = {};

    constructor(options?:any) {
        if (options) {
            if (options.uri) { this.uri = options.uri; }
            if (options.apikey) { 
                this.apikey = options.apikey; 
                this.rebuildHeader(); 
            }
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
        request.post(this.uri+"/api/v3/view", {headers:this.headers,json:{id}}, (err:Error, res:any, body:any)=>{
            if (err) cb(err);
            if (body) {
                cb(null, body);
            }
        })
    }

    //todo:
    packets() {}
    state() {}
    states() {}
    delete() {}

    socket() {}
    mqtt() {}

}