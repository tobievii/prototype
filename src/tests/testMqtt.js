var mqtt = require('mqtt');
var config = { apikey: "d3jfx3ixi4iyjdtbrzvx2oo7scujb1qu" };
var client  = mqtt.connect('mqtt://localhost:8080', {username:"api", password:"key-"+config.apikey});

client.on('connect', function () {
	console.log("connected.");

	client.subscribe(config.apikey, function (err) {
		if (err) { console.log(err) }
		console.log("subscribed.")
	})

	setInterval(()=>{
		client.publish(config.apikey, JSON.stringify({id:"mqttDevice1", data: { a: Math.random() }}) );
	},1000)
})

client.on('message', function (topic, message) {
	console.log(message.toString())
})