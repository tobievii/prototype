//import { testAccount, testDev } from './tests'

var socket = require("socket.io-client")("http://localhost:8080");
// var testKey = testAccount.apikey;
// var testDevice = testDev;

socket.on("connect", function(data) {
	console.log("connected. 1");
	socket.emit("join", "d3jfx3ixi4iyjdtbrzvx2oo7scujb1qu"); // your api key

	socket.on("post", data => {
		console.log(data);

	});
});

// socket.on("connect", function(data) {
// 	console.log("connected. 2");
// 	socket.emit("join", "d3jfx3ixi4iyjdtbrzvx2oo7scujb1qu+1"); // your api key

// 	socket.on("post", data => {
// 		console.log(data);
// 		test2 = true;
// 	});
// });



