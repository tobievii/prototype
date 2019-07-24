var net = require('net');

export class TeltonikaDeviceSim {

    host : string = "prototype.dev.iotnxt.io"
    port : number = 12001

    constructor(options:any) {
        if (options.host) this.host = options.host;
        if (options.port) this.port = options.port;
    }

    test() {
        var client = new net.Socket();
        console.log("attempting to connect")
        client.connect(this.port, this.host, function() {
            var testpacketIMEI = Buffer.from("000f333536333037303432343431303133", "hex");
            client.write(testpacketIMEI);
        });


        client.on('data', function(data:any) {
            console.log('Received:');
            console.log(data.toString("hex"));
            console.log(data.toString())
        
            if (data.toString("hex") === "01") {
                console.log("imei ack")
                var testpacketDATA = Buffer.from("000000000000008c08010000013feb55ff74000f0ea850209a6900009400d6120000001e09010002000300040016014703f0001504c8000c0900730a00460b00501300464306d7440000b5000bb60007422e9f180000cd0386ce000107c700000000f10000601a46000001344800000bb84900000bb84a00000bb84c00000000024e0000000000000000cf00000000000000000100003fca", "hex");
                client.write(testpacketDATA);
                return;
            }
        
            if (data.toString("hex") === "00000001") {
                console.log("data ack");
                //var testpacketDATA = Buffer.from("000000000000008c08010000013feb55ff74000f0ea850209a6900009400d6120000001e09010002000300040016014703f0001504c8000c0900730a00460b00501300464306d7440000b5000bb60007422e9f180000cd0386ce000107c700000000f10000601a46000001344800000bb84900000bb84a00000bb84c00000000024e0000000000000000cf00000000000000000100003fca", "hex");
                //client.write(testpacketDATA);
                //client.destroy();
                return;
            }
        
            if (data.toString() == "getinfo") {
                console.log("received command: getinfo")
                var reply = "RTC:2017/6/16 7:13 Init:2017/6/16 5:44 UpTime:4744s PWR:PwrVoltage RST:0 GPS:1 SAT:0 TTFF:0 TTLF:0 NOGPS: 1:18 SR:0 FG:200 FL:0 SMS:3 REC:42 MD:1 DB:0"
                client.write(Buffer.from(reply));
                return;
            }
            //client.destroy(); // kill client after server's response
        });
        
        client.on('close', function() {
            console.log('Connection closed');
            
        });
        
        
        client.on("error", (err:Error)=>{
            if (err) {
                console.log("error!")
                console.log(err);
            }
        
        })

    }
}