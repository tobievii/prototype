var net = require('net');
var mqtt = require('mqtt');










var config = { apikey: "dnjskllzve6xzv47l1mw72p74jqbjjz4p" };
var client = mqtt.connect('mqtt://prototype.dev.iotnxt.io', { username: "api", password: "key-" + config.apikey });

const devicename = "esp32mesh"

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
  console.log(message.toString())
})





function heartbeat() {
  client.publish(config.apikey, JSON.stringify({ id: devicename, data: { uptime: process.uptime() } }));
}



var nodes = [];


var server = net.createServer(function (socket) {
  socket.on("data", (data) => {
    //console.log(data);

    try {

      var dataparsed = JSON.parse(data.toString());
      dataparsed.timestamp = new Date().toISOString();

      console.log(dataparsed);

      var found = false;

      for (var node in nodes) {
        if (nodes[node].addr == dataparsed.addr) { found = true; nodes[node] = dataparsed; }
      }

      if (found == false) {
        nodes.push(dataparsed);
      }

      client.publish(config.apikey, JSON.stringify({ id: devicename, data: { mesh: dataparsed, nodecount: nodes.length, nodes } }));

    }
    catch (e) { }

  })

});

const portnum = 8070;
server.listen(portnum);
console.log("mesh server listening on " + portnum)

