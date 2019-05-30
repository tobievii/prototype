/*
  This example shows how to get serialport data into prototype cloud.

  npm install serialport
*/

// see https://www.npmjs.com/package/serialport
var SerialPort = require("serialport");

/* Uncomment below to list ports */
// SerialPort.list().then(list => console.log(list));
var port = new SerialPort("/dev/ttyACM0", { baudRate: 9600 }, (err) => {
  if (err) { console.error(err); } else {
    console.log("connected")
  }
})

var serialBuffer = "";

// listen to data
port.on("data", (chunk) => {

  // convert chunks to string and add to buffer
  serialBuffer += chunk.toString();

  // check if buffer has new line/carraige return
  var newlineIndex = serialBuffer.toString().indexOf("\r\n")
  if (newlineIndex != -1) {
    console.log(serialBuffer);
    serialBuffer = serialBuffer.slice(newlineIndex);
  }
})