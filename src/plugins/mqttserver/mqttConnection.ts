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
        // http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/errata01/os/mqtt-v3.1.1-errata01-os-complete.html#_Toc442180831
        return (data:Buffer) => {         

            console.log("\n---- mqtt packet ---- ")
            var packetTypeHex = data.slice(0,1).toString('hex')[0]
            var mqttPacketType =  Buffer.from('0'+packetTypeHex, 'hex')[0];
            console.log("mqttPacketType:"+mqttPacketType);
            var remainingLength = data.readInt8(1)
            console.log("remainLength:"+remainingLength)
            console.log("total Length"+data.length)
            console.log(data.toString("hex"));

            if (mqttPacketType == 1) {

                var connect:any = {
                    lengthMSB : data.readInt8(2),
                    lengthLSB : data.readInt8(3)
                    
                }
                connect.protocol = data.slice(4,4+connect.lengthLSB).toString();
                
                connect.protocolLevel = data.readInt8(8);

                connect.flagsBinaryStr = data.readUInt8(9).toString(2)
                connect.flags = {
                    reserved : checkBit(data.slice(9,10),0),
                    cleanSession : checkBit(data.slice(9,10),1),
                    willFlag : checkBit(data.slice(9,10),2),
                    willQosA : checkBit(data.slice(9,10),3),
                    willQosB : checkBit(data.slice(9,10),4),
                    willRetain : checkBit(data.slice(9,10),5),
                    passwordFlag : checkBit(data.slice(9,10),6),
                    usernameFlag : checkBit(data.slice(9,10),7)
                }

                connect.keepAlive = data.readInt16BE(10)

                var clientidLength = data.readInt16BE(12)
                connect.clientid = data.slice(14, 14+clientidLength).toString()

                var usernameLength = data.readInt16BE(14+clientidLength)
                var usernameOffset = 14+clientidLength+2
                connect.username = data.slice(usernameOffset, usernameOffset+usernameLength).toString()
                

                var passwordLength = data.readInt16BE(usernameOffset+usernameLength)
                var passwordOffset = usernameOffset+usernameLength+2
                connect.password = data.slice(passwordOffset, passwordOffset+passwordLength).toString()

                console.log(connect);

                
                this.emit("connect", connect)                

                socket.write(" \u0002\u0000\u0000");
                return;
            }
       
            if (mqttPacketType == 2) { 
                console.log("CONNACK") 
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
                console.log("SUBSCRIBE")



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




function checkBit(data:Buffer,bitnum:number) {
    //bitnum from right
    try {
        var binaryStr = data.readUInt8(0).toString(2);
        return parseInt(binaryStr.slice(binaryStr.length - bitnum - 1 , binaryStr.length - bitnum))
    } catch (err) {
        return undefined
    }
    
}