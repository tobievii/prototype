

var test = `16 03 01 00 d3 01 00 00 cf 03 01 90 d5 98 6b fb 
c3 1c 55 3f bd 00 0a 3e ea f7 53 1b 60 f7 41 e9 
e3 1d 25 2f 80 a7 b5 20 4a e0 e8 00 00 4e c0 14 
c0 0a 00 39 00 38 c0 0f c0 05 00 35 c0 12 c0 08 
00 16 00 13 c0 0d c0 03 00 0a c0 13 c0 09 00 33 
00 32 00 9a 00 99 c0 0e c0 04 00 2f 00 96 c0 11 
c0 07 c0 0c c0 02 00 05 00 04 00 15 00 12 00 09 
00 14 00 11 00 08 00 06 00 03 00 ff 01 00 00 58 
00 00 00 10 00 0e 00 00 0b 31 39 32 2e 31 36 38 
2e 34 2e 31 00 0b 00 04 03 00 01 02 00 0a 00 34 
00 32 00 01 00 02 00 03 00 04 00 05 00 06 00 07 
00 08 00 09 00 0a 00 0b 00 0c 00 0d 00 0e 00 0f 
00 10 00 11 00 12 00 13 00 14 00 15 00 16 00 17 
00 18 00 19 00 23 00 00`;

// test = test.split("\n").map((i) => {
//   i = i.trim().split(" ").join(" 0x")
//   return i;
// })

test = test.trim().split(" ").join("").split("\n").join("");

var hexin = Buffer.from(test, "hex")




var net = require('net');
var iotnxtqueue = new net.Socket();
iotnxtqueue.connected = false;

function sendIotnxt(packet) {
  if (iotnxtqueue.connected == false) {
    iotnxtqueue.connect(8883, 'amqp.greenqueue.qa.iotnxt.io', () => {
      console.log('Connected');
      iotnxtqueue.connected = true;
      iotnxtqueue.write(packet);
    });

    iotnxtqueue.on('data', (data) => {
      console.log('Received:' + data.length);
      console.log(data);
      //iotnxtqueue.destroy(); // kill iotnxtqueue after server's response
    });

    iotnxtqueue.on('close', () => {
      console.log('Connection closed');
      iotnxtqueue.connected = false;
    });

    iotnxtqueue.on("error", () => {
      iotnxtqueue.connected = false;
      sendIotnxt(packet);
    })

    iotnxtqueue.connected = true;
  } else {
    iotnxtqueue.write(packet);
  }
}


sendIotnxt(hexin);