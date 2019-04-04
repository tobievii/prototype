var net = require('net');
var mqtt = require('mqtt');










var config = { apikey: "4oxk9bg32xyncaxr6494z6jkqxb61tmf" };
var client = mqtt.connect('mqtt://localhost', { username: "api", password: "key-" + config.apikey });

const devicename = "esp32mesh"

var meshState = {
  "id": "iotmesh_mine",
  "data": { nodes: [] }
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






var server = net.createServer(function (socket) {

  socket.on("data", (data) => {
    console.log(socket.remoteAddress)
    //
    console.log(data.toString())

    try {

      var dataparsed = JSON.parse(data.toString());
      var device = dataparsed.data;
      device.addr = dataparsed.addr;                // move addr into device 
      device.timestamp = new Date().toISOString();  // timestamp data



      var found = false;
      for (var node in meshState.data.nodes) {
        if (meshState.data.nodes[node].addr == dataparsed.addr) { found = true; meshState.data.nodes[node] = dataparsed; }
      }

      if (found == false) {
        meshState.data.nodes.push(dataparsed);
      }

      //
      meshState.data.timestamp = new Date().toISOString();
      meshState.data.uptime = process.uptime();
      console.log(meshState);
      client.publish(config.apikey, JSON.stringify(meshState));
    }
    catch (e) {
      console.log("===== ERROR PARSING ====")
      console.log(e);
      console.log(data.toString());
      console.log("========================")
    }

  })

});

const portnum = 8071;
server.listen(portnum);
console.log("mesh server listening on " + portnum)


function updateMeshDevice(device) {

}


function updateMesh(device) {
  if (device.layer == 1) {
    meshState.data.root = device;
  }

  if (device.layer == 2) {
    console.log(device);
    //meshState.data.root = device;
  }
}