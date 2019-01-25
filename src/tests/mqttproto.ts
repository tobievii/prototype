var mqtt = require('mqtt');

import { EventEmitter } from "events"

export class MqttProto extends EventEmitter {

    constructor () {
        console.log("attempting to connect")
        super();

        var config = { apikey: "4vpw5gtrw4p3mdunmxpbm3qp76n37q4g" };
        var client  = mqtt.connect('mqtt://localhost', {username:"api", password:"key-"+config.apikey});
        
        client.on('connect', () => {
            console.log("connected.");
            this.emit("connect", {})
        
            client.subscribe(config.apikey, function (err) {
                if (err) { console.log(err) }
                console.log("subscribed.")
            })
        
            setInterval(()=>{
                client.publish(config.apikey, JSON.stringify({id:"mqttDevice1", data: { a: Math.random() }}) );
            },1000)
        })
        
        client.on('message', function (topic, message) {
            console.log(message.toString())
        })

    }

   

}


