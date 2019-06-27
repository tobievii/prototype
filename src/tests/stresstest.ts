/*
This test should test stability/throughput 
*/

import { generateRandomJsonDepth } from "./random"

if (process.argv.length == 2) {
  console.log("INVALID. MISSING ARGUMENT.\r\n\nTry this instead:\r\nnode stresstest.js apikeyhere")
}

if (process.argv.length == 3) {
  console.log("RUNNING...")
  stressTest(process.argv[2]);
}

export function stressTest(apikey: String) {
  console.log("stressTest on account: " + apikey)


  var socket = require("socket.io-client")("http://localhost:8080");

  socket.on("connect", () => {
    socket.emit("join", apikey); // your api key

    // socket.on("post", (data:any) => {
    //   console.log(data);
    // });

    var fakedata = generateRandomJsonDepth(4);
    console.log(fakedata);

    socket.emit("post", { id: "yourDevice001", data: fakedata })
  });

}



