//import { testAccount, testDev } from './tests'

var socket = require("socket.io-client")("http://localhost:8080");
// var testKey = testAccount.apikey;
// var testDevice = testDev;

var socket = require("socket.io-client")("http://localhost:8080");

socket.on("connect", function(data) {
	console.log("connected.");
	socket.emit("join", "d3jfx3ixi4iyjdtbrzvx2oo7scujb1qu"); // your api key

	socket.on("post", data => {
		console.log(data);
	});
});





