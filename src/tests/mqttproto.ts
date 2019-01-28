var mqtt = require('mqtt');
var testValue = false;
var client: any;
var config: any;

import { EventEmitter } from "events"

export class MqttProto extends EventEmitter {

    constructor (key: any) {
        super();

        config = { apikey: key };
        client  = mqtt.connect('mqtt://localhost', {username:"api", password:"key-"+config.apikey});
        
        client.on('connect', () => {
            this.emit("connect", {})
        
            client.subscribe(config.apikey, (err: any) => {
                if (err) { console.log(err); testValue = false; }
                else{ testValue = true; }
            })
        })
        
        client.on('message', function (topic: any, message: any) {
            if(topic === config.apikey){
                console.log(message.toString())
            }
        })  
    }

    postData(){
        if(client.publish(config.apikey, JSON.stringify({id:"testDeviceDEV", data: { someval: "Dev2-" + Math.round(Math.random() * 1000) }}) )){
            return true;
        }else{
            return false;
        }
    }
}