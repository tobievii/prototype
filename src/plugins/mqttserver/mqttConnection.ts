// ROUAN VAN DER ENDE

// http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html#_Toc398718037
// https://docs.solace.com/MQTT-311-Prtl-Conformance-Spec/MQTT%20Control%20Packet%20format.htm#_Toc430864887

import { EventEmitter } from "events";
import * as net from "net"
import * as accounts from "../../accounts"

import { log } from "../../utils"

export class mqttConnection extends EventEmitter {
    socket: net.Socket;
    apikey: string = "";

    constructor(socket: net.Socket) {
        super()
        this.socket = socket;
        socket.on("data", this.handleData(socket))
        socket.on("close", (err) => {
            console.log("close event")
            console.log(err)
            this.emit("close", err);
        })
    }

    publish = (topic: string, data: any) => {


        if (typeof data != "string") {
            data = JSON.stringify(data)
        }

        try {
            console.log("MQTT publishing to client")
            this.socket.write(buildMqttPublishPacket(topic, data));
        } catch (err) {
            console.log(err);
        }


        //this.socket.write(Buffer.from("30550020676c7035786d316a7077687477646e73796b76356e76346868777270317879397b226964223a2274657374446576696365222c2264617461223a7b2261223a302e393232373733393235393631383039337d7d", "hex"))
    }

    handleData = (socket: net.Socket) => {
        // http://docs.oasis-open.org/mqtt/mqtt/v3.1.1/errata01/os/mqtt-v3.1.1-errata01-os-complete.html#_Toc442180831
        return (data: Buffer) => {

            //console.log("\n---- mqtt packet ---- ")
            var packetTypeHex = data.slice(0, 1).toString('hex')[0]
            var mqttPacketType = Buffer.from('0' + packetTypeHex, 'hex')[0];
            //console.log("mqttPacketType:"+mqttPacketType);
            var remainingLength = data.readUInt8(1)
            // console.log("remainLength:"+remainingLength)
            // console.log("total Length"+data.length)

            // console.log(data.toString("hex"));
            // console.log(data.toString())

            if (mqttPacketType == 1) {

                var connect: any = {
                    lengthMSB: data.readInt8(2),
                    lengthLSB: data.readInt8(3)

                }
                connect.protocol = data.slice(4, 4 + connect.lengthLSB).toString();

                connect.protocolLevel = data.readInt8(8);

                connect.flagsBinaryStr = data.readUInt8(9).toString(2)
                connect.flags = {
                    reserved: checkBit(data.slice(9, 10), 0),
                    cleanSession: checkBit(data.slice(9, 10), 1),
                    willFlag: checkBit(data.slice(9, 10), 2),
                    willQosA: checkBit(data.slice(9, 10), 3),
                    willQosB: checkBit(data.slice(9, 10), 4),
                    willRetain: checkBit(data.slice(9, 10), 5),
                    passwordFlag: checkBit(data.slice(9, 10), 6),
                    usernameFlag: checkBit(data.slice(9, 10), 7)
                }

                connect.keepAlive = data.readInt16BE(10)

                var clientidLength = data.readInt16BE(12)
                connect.clientid = data.slice(14, 14 + clientidLength).toString()

                var usernameLength = data.readInt16BE(14 + clientidLength)
                var usernameOffset = 14 + clientidLength + 2
                connect.username = data.slice(usernameOffset, usernameOffset + usernameLength).toString()


                var passwordLength = data.readInt16BE(usernameOffset + usernameLength)
                var passwordOffset = usernameOffset + usernameLength + 2
                connect.password = data.slice(passwordOffset, passwordOffset + passwordLength).toString()

                console.log(connect);

                //CHECK APIKEY
                var apikey = connect.password.split("-")
                if ((apikey[0] == "key") && (apikey.length == 2)) {
                    apikey = apikey[1]
                    accounts.checkApiKey(apikey, (err: Error, result: any) => {



                        if (err) {
                            console.log("NOT VALID")
                            console.log(err);
                            socket.destroy();
                            return;
                        }


                        this.apikey = apikey;
                        this.emit("connect", connect)
                        socket.write(" \u0002\u0000\u0000");
                    })
                } else {

                    socket.destroy();
                }

                //return;
            }

            if (mqttPacketType == 2) {
                console.log("CONNACK")
            }

            if (mqttPacketType == 3) {
                log("PUBLISH")
                var parsed = parseMqttPublish(data)
                // //console.log(data.toString("hex"))
                // console.log( data.slice(2,3).toString('hex'))

                // var topicLength = 32; //Buffer.from(data.slice(3,4).toString('hex'), "hex")[0];
                // var packetLength = Buffer.from(data.slice(1,2).toString('hex'), "hex")[0] - topicLength -2;

                // console.log(topicLength)
                // console.log(packetLength)

                // var parsed = {
                //     //raw : data,
                //     //rawString : data.toString(),
                //     //topicLength : topicLength,
                //     topic : data.toString().slice(5, 5+topicLength ),
                //     payload : data.toString().slice(4+topicLength),
                //     //packetLength: packetLength
                // }   

                //console.log(parsed)

                this.emit("publish", parsed)
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
                console.log("SUBSCRIBE ----------------------------")
                console.log(data)
                console.log(data.toString())
                console.log("---------------------------")
                var parse: any = {}

                //console.log(parseInt(data.slice(0,1).toString("hex"), 16).toString(2)) // 10000010               
                //console.log( bufferToBinary(data, 0) ) // 1000 0010   - always

                //parse.packetIdentifier = getPacketIdentifier(data.slice(1,5)).total
                parse.packetIdentifier = data.slice(2, 4)

                //console.log("------")
                for (var d = 0; d < data.length; d++) {
                    console.log(d + "\t" + bufferToBinary(data, d) + "\t" + data.slice(d, d + 1).toString())
                }
                // console.log(bufferToBinary(data, 0))       // MQTT CONTROL PACKET TYPE 8
                // console.log(bufferToBinary(data, 1))       // REMAINING LENGTH
                // console.log(bufferToBinary(data, 2))       // PACKET IDENTIFIER MSB
                // console.log(bufferToBinary(data, 3))       // PACKET IDENTIFIER LSB
                // console.log(bufferToBinary(data, 4)) //
                // console.log(bufferToBinary(data, 5)) //
                // console.log(bufferToBinary(data, 6))
                // console.log(bufferToBinary(data, 7))
                // console.log(bufferToBinary(data, 8))
                //console.log("------")

                parse.remainingLength = getRemainingLength(data)

                var subTopics = true;
                parse.subs = []

                var topicParseByte = 4

                while (subTopics) {
                    var st: any = {}
                    st.length = data.readUInt16BE(topicParseByte);
                    var topicStartByte = topicParseByte + 2
                    var topicEndByte = topicStartByte + st.length
                    st.topic = data.slice(topicStartByte, topicEndByte).toString();
                    st.qos = parseInt(bufferToBinary(data, topicEndByte).slice(-2), 2);
                    parse.subs.push(st)
                    topicParseByte = topicEndByte + 5
                    if ((data.length - topicEndByte) < 5) {
                        subTopics = false;
                    }
                }



                // parse.topicLength = data.readUInt16BE(4);
                // parse.topic = data.slice(6, -1).toString()
                // parse.qos = parseInt(bufferToBinary(data, data.length - 1).slice(-2), 2);
                // parse.remainingLength = getRemainingLength(data)
                // parse.topicLengthTest = data.readUInt16BE(33)

                // parse.packetType = data.slice(0,1).toString('hex')[0]
                // parse.totalLength = data.length;
                //data.readUInt8(1)


                // var offset = parse.remainingLength.bytenum;
                // offset  += 2;
                // var topicLength = Buffer.from(data.slice(offset,offset+1).toString('hex'), "hex")[0];

                // console.log(topicLength)

                // offset += 3;
                // parse.topic = data.slice(offset,-1).toString() 
                // offset += topicLength;
                // parse.payload = data.slice(offset).toString()
                // return parse;

                console.log(parse)

                //console.log("suback.")
                var suback = Buffer.concat([
                    Buffer.from([parseInt("10010000", 2)]),
                    Buffer.from([3]),
                    parse.packetIdentifier,
                    Buffer.from([parse.qos])
                ])
                console.log(suback);
                socket.write(suback);

                for (var sub of parse.subs) {
                    this.emit("subscribe", {
                        subscribe: sub.topic
                    })
                }



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

function parseMqttPublish(data: any) {
    var parse: any = {}
    parse.packetType = data.slice(0, 1).toString('hex')[0]
    parse.totalLength = data.length;
    parse.remainingLength = getRemainingLength(data) //data.readUInt8(1)
    var offset = parse.remainingLength.bytenum;
    offset += 2;
    var topicLength = Buffer.from(data.slice(offset, offset + 1).toString('hex'), "hex")[0];
    offset += 1;
    parse.topic = data.slice(offset, offset + topicLength).toString()
    offset += topicLength;
    parse.payload = data.slice(offset).toString()
    return parse;
}

function getRemainingLength(data: any) {

    var remainingdata = true;
    var total = 0;
    var bytenum = 0;
    if (data[1] <= 127) {

        total += data[1]
        bytenum = 1;
    } else {

        bytenum = 2;
        total += data[1] - 128

        if (data[2] <= 127) {

            total += data[2] * 128
        } else {
            bytenum = 3;
            total += (data[2] - 128) * 128
            total += data[3] * (128 * 128)
        }
    }

    return { total, bytenum }
}




function getPacketIdentifier(data: any) {

    var remainingdata = true;
    var total = 0;
    var bytenum = 0;
    if (data[1] <= 127) {

        total += data[1]
        bytenum = 1;
    } else {

        bytenum = 2;
        total += data[1] - 128

        if (data[2] <= 127) {

            total += data[2] * 128
        } else {
            bytenum = 3;
            total += (data[2] - 128) * 128
            total += data[3] * (128 * 128)
        }
    }

    return { total, bytenum }
}


function checkBit(data: Buffer, bitnum: number) {
    //bitnum from right
    try {
        var binaryStr = data.readUInt8(0).toString(2);
        return parseInt(binaryStr.slice(binaryStr.length - bitnum - 1, binaryStr.length - bitnum))
    } catch (err) {
        return undefined
    }

}




function buildMqttPublishPacket(topic: any, data: any) {

    console.log("----------")
    console.log(topic);
    console.log(data);
    console.log("----------")

    var totalLength = topic.length + data.length + 2
    var remainingdataBuffer;

    if (totalLength <= 127) {
        remainingdataBuffer = Buffer.from([totalLength])
    } else {
        if (totalLength <= 16383) {
            remainingdataBuffer = Buffer.from([128 + (totalLength % 128), Math.floor(totalLength / 128)])
        } else {
            remainingdataBuffer = Buffer.from([128 + (totalLength % 128), 128 + (Math.floor((totalLength % (128 * 128)) / 128)), Math.floor(totalLength / (128 * 128))])
        }

    }
    //console.log(remainingdataBuffer)

    var pubbuf = Buffer.concat([Buffer.from([0b00110000]), //header
        remainingdataBuffer,
    Buffer.from([
        Math.floor(topic.length / 256),                 //topic length MSB
        topic.length,                                 //topic length LSB
    ]),
    Buffer.from(topic),
    Buffer.from(data)
    ])



    return pubbuf;
}


function bufferToBinary(bufferIn: Buffer, byteNu: number) {
    var binarystring = parseInt(bufferIn.slice(byteNu, byteNu + 1).toString("hex"), 16).toString(2)
    while (binarystring.length < 8) {
        binarystring = "0" + binarystring;
    }

    return binarystring
}