var net = require('net');
var mqtt = require('mqtt');










var config = { apikey: "4oxk9bg32xyncaxr6494z6jkqxb61tmf" };
var client = mqtt.connect('mqtt://localhost', { username: "api", password: "key-" + config.apikey });

const devicename = "esp32mesh"

var meshState = {
  "id": "iotmesh_mine",
  "data": {}
}


client.on('connect', function () {
  console.log("connected.");

  client.subscribe(config.apikey + "|" + devicename, function (err) {
    if (err) { console.log(err) }
    console.log("subscribed.")
  })

  setInterval(() => {
    heartbeat();
  }, 30000)
  heartbeat();
})

client.on('message', function (topic, message) {
  //console.log(message.toString())
})





function heartbeat() {
  meshState.data.uptime = process.uptime();
  client.publish(config.apikey, JSON.stringify(meshState));
}



var nodes = [];


var server = net.createServer(function (socket) {
  socket.on("data", (data) => {

    console.log(data.toString());


    // try {

    //   var dataparsed = JSON.parse(data.toString());
    //   dataparsed.timestamp = new Date().toISOString();

    //   console.log("\n")
    //   console.log(dataparsed);
    //   console.log("\n")

    //   var found = false;

    //   for (var node in nodes) {
    //     if (nodes[node].addr == dataparsed.addr) { found = true; nodes[node] = dataparsed; }
    //   }

    //   if (found == false) {
    //     nodes.push(dataparsed);
    //   }

    //   meshState.data.uptime = process.uptime();
    //   console.log(meshState);


    //   client.publish(config.apikey, JSON.stringify(meshState));

    // }
    // catch (e) { }

  })

});

const portnum = 8070;
server.listen(portnum);
console.log("mesh server listening on " + portnum)

