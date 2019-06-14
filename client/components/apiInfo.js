import React, { Component, Suspense } from "react";
// const SyntaxHighlighter = import('react-syntax-highlighter');
// const tomorrowNightBright = import("react-syntax-highlighter/styles/hljs");

import { CodeBlock } from "./codeBlock.jsx"

export class ApiInfo extends Component {
  state = {
    apiMenu: 1,
    testPacket: {
      "id": "yourDevice001",
      "data": {
        "temperature": 24.54,
        "doorOpen": false,
        "gps": {
          "lat": 25.123,
          "lon": 28.125
        }
      }
    }
  };

  handleCopyClipboard() {
    var textField = document.createElement("textarea");
    textField.innerText = $("#postSample").html();
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  getMenuClasses = function (num) {
    if (num == this.state.apiMenu) {
      return "menuTab borderTopSpot"
    } else {
      return "menuTab menuSelectable"
    }
  }

  getMenuPageStyle = function (num) {
    if (num == this.state.apiMenu) {
      return { display: "" }
    } else {
      return { display: "none" }
    }
  }

  onClickMenuTab = function (num) {
    return (event) => {
      /*
      console.log(event);
      event.currentTarget.className = "col-md-2 menuTab borderTopSpot";
      console.log(num)
      */
      var apiMenu = num;
      this.setState({ apiMenu })
    }
  }

  sendHttpRestTest = () => {
    //console.log("TEST")
    fetch("/api/v3/data/post", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(this.state.testPacket)
    }).then(response => response.json()).then(resp => {
      //console.log(resp);
    }).catch(err => console.error(err.toString()));
  }

  render() {
    var apiCall = { path: window.location.origin }

    var samplePacket = { "id": "yourDevice001", "data": { "temperature": 24.54, "doorOpen": false, "gps": { "lat": 25.123, "lon": 28.125 } } }

    var authheader = 'Basic ' + Buffer.from("api:key-" + this.props.apikey).toString('base64')


    return (
      <div className="apiInfo" style={{ paddingTop: 0, margin: "0 25px", marginTop: "60px" }} >

        <div className="row apiInfoMenu">
          <div className={this.getMenuClasses(1)} onClick={this.onClickMenuTab(1)} >APIKEY</div>
          <div className={this.getMenuClasses(2)} onClick={this.onClickMenuTab(2)}>HTTP REST</div>
          <div className={this.getMenuClasses(3)} onClick={this.onClickMenuTab(3)}>SOCKET.IO</div>
          <div className={this.getMenuClasses(4)} onClick={this.onClickMenuTab(4)} >MQTT</div>
        </div>

        <div className="row" style={this.getMenuPageStyle(1)}>
          <div className="col-md-12 commanderBgPanel" ><br />
            <p>
              To get started we recommend using the HTTP REST api at first.
            </p>
          </div>

          <div className="col-md-6 commanderBgPanel">
            <h4>YOUR API KEY:</h4>
            <p id="accountApikey" className="commanderBgPanel">
              <span className="spot">{this.props.apikey}</span>
            </p>
          </div>
          <div className="col-md-6 commanderBgPanel">
            <p>The procedure involves setting up the authentication headers for the call and pointing the call to the correct server. You may also add the body with data if applicable.<br />
              The type of authorization needs to be "Basic Auth" with these details:<br /><br />
              Username: <span className="spot">api</span><br />
              Password: <span className="spot">key-{this.props.apikey}</span>
            </p>
            <p>Using tools such as <a href="https://www.getpostman.com/">POSTMAN</a>, you can generate a base64 encoded header automatically. Depending on the tool used to make the call, an "Authorization" header may need to be generated manually.</p>
          </div>

          <div className="col-md-12 commanderBgPanel" >
            <h4>HEADERS</h4>

            <p>Only two headers are required. The tool/software used will usually handle the Authorization header construction based on the username/password.</p>

            <pre className="commanderBgPanel" style={{ fontSize: 12 }}>
              "Authorization":"{authheader}"<br />
              "Content-Type":"application/json"
            </pre>
          </div>
        </div>



        <div className="row" style={this.getMenuPageStyle(2)}>

          <div className="col-12 commanderBgPanel" style={{ marginBottom: 20 }}>
            <h4 className="spot" style={{ padding: "30px 0 0 0" }}>HTTP</h4>

            <p>Documentation for HTTP(S) REST API:</p>

            <p>Sending and recieving data using HTTP(S) is the simplest. If you need to
            have a device connect and wait for commands from the cloud the best would
              be to use MQTT or SOCKET.IO instead.</p>

            <p>Example code for python, C# and node/js is available here: <a href="https://github.com/IoT-nxt/prototype/tree/dev/examples">https://github.com/IoT-nxt/prototype/tree/dev/examples</a></p>
          </div>

          <div className="col-xl-6 commanderBgPanel" >
            <p style={{ paddingTop: 10 }}>The API call to add a device and update a device is identical. The data will be merged in the current state. Changes will be stored as packets and these packets will represents the history of a device.</p>
            <p>You can make the "id" anything you want as long as it is unique to your account. </p>
            <p>The "data" section of the packet can contain anything you'd like as long as it is valid JSON.</p>
          </div>

          <div className="col-xl-6 commanderBgPanel" >
            <div className="row" style={{ paddingTop: 30 }}>
              <div className="col-md-3">
                <h6>METHOD:</h6>
                <pre className="commanderBgPanel">POST</pre>
              </div>
              <div className="col-md-9">
                <h6>URL</h6>
                <pre className="commanderBgPanel">{apiCall.path + "/api/v3/data/post"}</pre>
              </div>

              <div className="col-md-12">
                <h6>BODY ( Content-Type: "application/json" )</h6>
                <CodeBlock language='javascript' value={`{ 
  "id": "yourDevice001", 
  "data": { 
    "temperature": 24.54, 
    "doorOpen": false, 
    "gps": { 
      "lat": 25.123, 
      "lon": 28.125 
    } 
  } 
}`} />

              </div>
              <div className="col-md-12">
                <button onClick={this.sendHttpRestTest}>TEST</button>
              </div>

              <div className="col-md-12">
                <h5 style={{ paddingTop: 20 }}>QUICK CURL SNIPPET:</h5>

                <CodeBlock language='bash' value={"curl --user 'api:key-" +
                  this.props.apikey +
                  '\' -X POST -H "Content-Type: application/json" -d \'' + JSON.stringify(samplePacket) + '\' ' +
                  window.location.origin +
                  "/api/v3/data/post"} />
              </div>

            </div>
          </div>





          <div className="col-md-6 commanderBgPanel" >
            <h4 className="spot" style={{ paddingTop: 50 }}></h4>
            <p>To get all the current device state data is simple. Just click on the url on the right.</p>
          </div>

          <div className="col-md-6 commanderBgPanel" >

            <div className="row" style={{ paddingTop: 60 }}>
              <div className="col-md-3">
                <h6>METHOD:</h6>
                <pre className="commanderBgPanel">GET</pre>
              </div>
              <div className="col-md-9">
                <h6>URL</h6>
                <div className="commanderBgPanel"><a className="apidocsLinkUrl" href={apiCall.path + "/api/v3/states"}>{apiCall.path + "/api/v3/states"}</a></div>
              </div>

              <div className="col-12">
                <h5 style={{ paddingTop: 20 }}>QUICK CURL SNIPPET:</h5>

                <CodeBlock language='bash' value={"curl --user 'api:key-" +
                  this.props.apikey +
                  '\' -X GET -H "Content-Type: application/json" ' +
                  window.location.origin +
                  "/api/v3/states"} />
              </div>

            </div>

          </div>


        </div >

        <div className="row" style={this.getMenuPageStyle(3)}>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot" style={{ paddingTop: 30 }}>SOCKET.IO</h4>
            <p>This page uses socket.io for real-time connectivity in the browser. This can also be used from the command line.</p>

            <p>Node.js</p>

            <p>Download <a href="https://nodejs.org/en/">Node.js</a> and duplicate the code below in a <b>test.js</b> file. This code will connect to your account and stream data to your terminal. We use this method to keep a connection open to the server and will be ready to receive data when needed. This example will stream data from all your devices if configured correctly.</p>


            <CodeBlock language='javascript' value={`var socket = require("socket.io-client")("` + apiCall.path + `", { transports: ['websocket'] });
socket.on("connect", function (data) {
  console.log("connected.");
  socket.emit("join", "` + this.props.apikey + `"); // your api key

  // or subscribe to a specific device: 
  // socket.emit("join", "` + this.props.apikey + `|yourdevice001");

  // Receive data:
  socket.on("post", data => {
    console.log(data);
  });
});

// Send some data:
setInterval( ()=>{
  socket.emit("post", {id: "yourDevice001", data: { temperature: 25.0 } } )
},1000)

`} />

            <p>Install the socket.io-client dependency from the same folder.</p>

            <CodeBlock language="js" value={`// install the socket.io-client dependeny
$ npm install socket.io-client
// run your code
$ node test.js
connected.`} />

          </div>
        </div>


        <div className="row" style={this.getMenuPageStyle(4)}>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot" style={{ paddingTop: 30 }}>MQTT</h4>
            <p>This code example is for nodejs users, but should be similar for other mqtt clients</p>

            <CodeBlock language="javascript" value={`
var mqtt = require('mqtt');
var config = { apikey: "` + this.props.apikey + `" };
var client  = mqtt.connect("mqtt://` + window.location.hostname + `", {username:"api", password:"key-" + config.apikey });

client.on('connect', function () {
  console.log("connected.");
  client.subscribe(config.apikey, function (err) {
    if (err) { console.log(err) }
    console.log("subscribed.")
  })
  
  setInterval(()=>{
    client.publish(config.apikey, JSON.stringify({id:"mqttDevice01", data: { a: Math.random() }}) );
  },1000)
})

client.on('message', (topic, message) => { console.log(message.toString()); })`} />

          </div>
        </div>


      </div >
    );
  }
}

//export default ApiInfo;
