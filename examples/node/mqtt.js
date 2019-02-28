var mqtt = require('mqtt');
var config = { apikey: "bi7rhd0p92inasjkdnsajnorjqcv1tk" };
var client  = mqtt.connect('mqtt://prototype.iotnxt.io', {username:"api", password:"key-"+config.apikey});

client.on('connect', function () {
	console.log("connected.");

	client.subscribe(config.apikey+"|esp32", function (err) {
		if (err) { console.log(err) }
		console.log("subscribed.")
	})

	setInterval(()=>{
		client.publish(config.apikey, JSON.stringify({id:"mqttDevice01", data: { a: Math.random() }}) );
	},1000)
})

client.on('message', function (topic, message) {
	console.log(message.toString())
})