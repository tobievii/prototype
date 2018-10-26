// ROUAN VAN DER ENDE

// http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718037

import { EventEmitter } from "events";
import * as net from "net"

export class mqttConnection extends EventEmitter {
    constructor (socket:net.Socket) {
        super()
        socket.on("data", this.handleData(socket))
    }

    handleData = (socket:net.Socket) => {
        return (data:Buffer) => {         
            var packetTypeHex = data.slice(0,1).toString('hex')[0]
            var mqttPacketType =  Buffer.from('0'+packetTypeHex, 'hex')[0];

            if (mqttPacketType == 1) {
                this.emit("connect", {
                    clientid : data.toString().split("\u0004�\u0000<\u0000\u000f")[1].split("\u0000\u0003")[0],
                    username : data.toString().split("\u0000\u0003")[1].split("\u0000$")[0],
                    password : data.toString().split("\u0000$")[1]
                })                
                socket.write(" \u0002\u0000\u0000");
                return;
            }
       
            if (mqttPacketType == 2) { 
                //console.log("CONNACK") 
            }

            if (mqttPacketType == 3) { 
                //console.log("PUBLISH") 
                var topicLength = Buffer.from(data.slice(3,4).toString('hex'), "hex")[0];
                var packetLength = Buffer.from(data.slice(1,2).toString('hex'), "hex")[0] - topicLength -2;

                this.emit("publish", {
                    //raw : data,
                    //rawString : data.toString(),
                    //topicLength : topicLength,
                    topic : data.toString().slice(4, 4+topicLength ),
                    payload : data.toString().slice(4+topicLength),
                    //packetLength: packetLength
                })
            }

            if (mqttPacketType == 4) { 
                console.log("PUBACK") 
            }
            if (mqttPacketType == 5) { 
                console.log("PUBREC") 
            }
            if (mqttPacketType == 6) { 
                console.log("PUBREL") 
            }
            if (mqttPacketType == 7) { 
                console.log("PUBCOMP") 
            }
            
            if (mqttPacketType == 8) {
                this.emit("subscribe", {
                    subscribe: data.toString().split("\u0000")[1].slice(1)
                })
                return;
            }

            if (mqttPacketType == 9) { console.log("SUBACK") }
            if (mqttPacketType == 10) { console.log("UNSUBSCRIBE") }
            if (mqttPacketType == 11) { console.log("UNSUBACK") }
            if (mqttPacketType == 12) { console.log("PINGREQ") }
            if (mqttPacketType == 13) { console.log("PINGRESP") }
            if (mqttPacketType == 14) { console.log("DISCONNECT") }
            // console.log("---")
            // console.log(data.toString());
            // console.log(data.toString().length)
            
        }
    }
    
  
}   

