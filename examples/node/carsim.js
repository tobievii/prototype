var socket = require("socket.io-client")("https://prototype.iotnxt.io");

socket.on("connect", function(data) {
	console.log("connected.");
	socket.emit("join", "p5gy91l2alrpvl433pxi6y86stk6gnme"); // your api key

	socket.on("post", data => {
		console.log(data);
	});
});




var car = {
  id : "rouan944",
  data: {
    speed : 83.1,
    gear : 4,
    input: {
      throttle : 55,
      brake : 0,
      clutch : 25,
      steeringAngle: 0
    },
    gps: {
      lat: 25.123,
      lon: 28.125
    }
  }  
}

setInterval( ()=>{
  socket.emit("post", car )
},500)