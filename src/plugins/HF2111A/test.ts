import * as net from "net";

export function test() {
  // net.createServer(function (socket) {
  //   socket.write("HF2111A_8927000005314782702f")
  //   socket.on("data", (data) => {
  //     console.log(data)
  //   })
  // }).listen(12900);


  var device = new net.Socket();
  device.connect(12900, 'localhost', function () {
    console.log('Test device connected');
    device.write("HF2111A_8927000005314782702f");
  });

  device.on('data', function (data) {
    console.log('Received: ' + data);
    //device.destroy(); // kill device after server's response
  });

  device.on('close', function () {
    console.log('Connection closed');
  });

  device.on("error", (err) => {
    console.log(err);
  })

}

