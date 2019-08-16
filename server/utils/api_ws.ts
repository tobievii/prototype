import { EventEmitter } from "events";
const WebSocket = require('ws');

export class PrototypeWS extends EventEmitter {
    ws:any;
    uri:string;

    constructor(uri:string, options:any) {
        super();

        if (uri.split("://")[0] == "http") {
            this.uri = "ws://"+uri.split("://")[1]
        } else {
            this.uri = "wss://"+uri.split("://")[1]
        }

        this.ws = new WebSocket(this.uri);

        this.ws.on('open', () => {
            //this.ws.send('something');
            this.emit("connect");
        });
          
        this.ws.on('message', function incoming(data) {
            console.log(data);
        });
        
        
        // console.log(options);

        // console.log("proto ws init")

        // setTimeout(()=>{
        //     this.emit("connect", {});
        // },100);
        

        this.on("join", (channel)=>{ 
            let message = {join:channel}
            this.ws.send(JSON.stringify(message))
        })
    }
}