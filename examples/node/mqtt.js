var mqtt = require('mqtt');
var config = { apikey: "glp5xm1jpwhtwdnsykv5nv4hhwrp1xy9" };
var client  = mqtt.connect('mqtt://localhost', {username:"api", password:"key-"+config.apikey});

client.on('connect', function () {
	console.log("connected.");

	var topic = "ABCDEFGHIJKLMN"

	console.log("topiclength:\t"+topic.length)

	client.subscribe(topic, {qos:0}, function (err) {
		if (err) { console.log(err) }
		console.log("subscribed.")
	})

	// setInterval(()=>{
	// 	client.publish(config.apikey, JSON.stringify({id:"mqttDevice01", data: { a: Math.random() }}) );
	// },1000)
})

client.on('message', function (topic, message) {
	console.log(message.toString())
})