import React, { Component } from "react";
import * as $ from "jquery";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrowNightBright } from 'react-syntax-highlighter/styles/hljs';

export class ApiInfo extends Component {
  state = {
    apiMenu : 1
  };

  handleCopyClipboard() {
    var textField = document.createElement("textarea");
    textField.innerText = $("#postSample").html();
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  getMenuClasses = function (num ) {
    if (num == this.state.apiMenu) {
      return "menuTab borderTopSpot"
    } else {
      return "menuTab menuSelectable"
    }
  }

  getMenuPageStyle = function (num ) {
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
     this.setState( { apiMenu})
    }
  } 

  render() {

    


    var apiCall = { path: window.location.origin  }

    var samplePacket = { "id": "yourDevice001", "data": { "temperature": 24.54, "doorOpen": false, "gps": { "lat": 25.123, "lon": 28.125} } }
    var samplePacket2 = { "id": "yourDevice001" }

    var authheader = 'Basic ' + Buffer.from("api:key-" + this.props.apikey).toString('base64')

    var curlPostSample =
      "curl --user 'api:key-" +
      this.props.apikey +
      '\' -X POST -H "Content-Type: application/json" -d \'' + JSON.stringify(samplePacket) + '\' ' +
      window.location.origin +
      "/api/v3/data/post";

    var curlViewSample =
    "curl --user 'api:key-" +
    this.props.apikey +
    '\' -X POST -H "Content-Type: application/json" -d \'' + JSON.stringify({ "id": "yourDevice001" }) + '\' ' +
    window.location.origin +
    "/api/v3/view";

    var codeStringRealtimeSocketIo = 'var socket = require("socket.io-client")("'+apiCall.path+'");\n\nsocket.on("connect", function(data) {\n\tconsole.log("connected.");\n\tsocket.emit("join", "'+this.props.apikey+'"); // your api key\n\n\tsocket.on("post", data => {\n\t\tconsole.log(data);\n\t});\n});';
    var codeStringRealtimeSocketIoResult = '{ id: \'yourDevice001\',\n  data:\n    { temperature: 24.54,\n      doorOpen: false,\n      gps: { lat: 25.123, lon: 28.125 } },\n  timestamp: \'2018-08-27T08:42:30.512Z\' }';
    var codeStringRealtimeSocketIoSingleDevice = 'socket.emit("join", "'+this.props.apikey+'|yourDevice001"); // your api key | device id';

    return (
      <div className="" style={{ paddingTop: 0, margin: "0 37px" }} >

        <div className="row"> 
          <div className={this.getMenuClasses(1)} onClick={this.onClickMenuTab(1) } >APIKEY</div>
          <div className={this.getMenuClasses(2)} onClick={this.onClickMenuTab(2) }>HTTP REST</div>
          <div className={this.getMenuClasses(3)} onClick={this.onClickMenuTab(3) }>SOCKET.IO</div>
          <div className={this.getMenuClasses(4)} onClick={this.onClickMenuTab(4) } >MQTT</div>
          <div className={this.getMenuClasses(5)} onClick={this.onClickMenuTab(5) } >PYTHON</div>
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
            <p>The procedure is to setup the authentication headers for the call, point in the right direction (server) and body of data if applicable.<br />
              You must use "Basic Auth" type with these details:<br /><br />
              Username: <span className="spot">api</span><br />
              Password: <span className="spot">key-{this.props.apikey}</span>
            </p>
            <p>In tools like <a href="https://www.getpostman.com/">POSTMAN</a> this will generate a base64 encoded header automatically. Depending on what tools you use you might have to generate the "Authorization" header yourself.</p>
          </div>
      
          <div className="col-md-12 commanderBgPanel" >
            <h4>HEADERS</h4>

            <p>We require only two headers. And usually your software will handle the Authorization header construction from the username/password.<br /> </p>

            <pre className="commanderBgPanel" style={{ fontSize: 12 }}>
              "Authorization":"{authheader}"<br />
              "Content-Type":"application/json"
            </pre>
          </div>
        </div>



        <div className="row" style={this.getMenuPageStyle(2)}>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot">HOW TO CREATE AN ENDPOINT AND UPDATE ITS DATA</h4>
            <p>Creating a new device and updating it is simple.</p>
            <p>The api to send data as a device is exactly the same as updating the server. Data is merged in the current state. While changes are stored as packets and represents the history of a device. Each device has an id, the id only needs to be unique to your account. The recommend method of starting integration is through our HTTPS REST API, though sockets.io is also available.</p>
            <h6>METHOD PATH</h6>
            <pre className="commanderBgPanel">POST {apiCall.path + "/api/v3/data/post"}</pre>
            <h6>BODY DATA ("application/json")</h6>
            
            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>{JSON.stringify(samplePacket, null, 2)}</SyntaxHighlighter>
            <p>You can make the "id" anything you want as long as it is unique to your account and api key. When sending data you <span className="spot">MUST</span> have a "data" parameter.</p>
            <h4>HOST AND PATH</h4>
            <p>Finally we have to send the query in the right direction.</p>
            <h6>CURL EXAMPLE</h6>
            <p className="commanderBgPanel" id="postSample" >{curlPostSample}</p>
          </div>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot">HOW TO RETRIEVE AN ENDPOINTS STATE</h4>
            <p>This call sends the ID you are interested in, and the server responds with that ID's latest state.</p>
            <h6>METHOD PATH</h6>
            <pre className="commanderBgPanel">POST {apiCall.path + "/api/v3/view"}</pre>
            <h6>BODY DATA ("application/json")</h6>
            
            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>{JSON.stringify(samplePacket2)}</SyntaxHighlighter>
            <p>Ofcourse the id must already exist on your account.</p>

            <h6>CURL EXAMPLE</h6>
            <p className="commanderBgPanel" >{curlViewSample}</p>
            <h4>RESPONSE</h4>
            <p>The server will respond with data about the latest state of the device. Example:</p>
            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>{ JSON.stringify(JSON.parse('{"_id":"5b80078bd6033ba3181c1a51",\n"apikey":"'+this.props.apikey+'",\n"devid":"yourDevice001",\n"payload":{"id":"yourDevice001","data":{"temperature":24.54,"doorOpen":false,"gps":{"lat":25.123,"lon":28.125}},"timestamp":"2018-08-27T08:41:31.719Z"},\n"meta":{"user":{},\n"created":{"unix":1535359291719,"jsonTime":"2018-08-27T08:41:31.719Z"},"ip":"::ffff:127.0.0.1","ipLoc":null,"userAgent":"curl/7.58.0","method":"POST"}}'),null,2) }</SyntaxHighlighter>
          </div>
        </div>





        <div className="row" style={this.getMenuPageStyle(3)}>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot">SOCKET.IO</h4>
            <p>This page uses socket.io for realtime connectivity in the browser, but this can also be used from the command line.</p>

            <p>node.js</p>

            <p>Download <a href="https://nodejs.org/en/">node.js</a> and save the below code into <b>test.js</b> file. This code will connect to your account and stream data to your terminal. This method keeps a connection open to the server, so it is ready to recieve data as needed. So as is this example will stream data from all your devices.</p>

            <SyntaxHighlighter language='javascript' showLineNumbers={true} style={tomorrowNightBright}>{codeStringRealtimeSocketIo}</SyntaxHighlighter>

            <p>On line 5 you can alternatively connect to a specific device by using the | (pipe) character in between your api key and the device id:</p>
            <SyntaxHighlighter startingLineNumber={5} language='javascript' showLineNumbers={true} style={tomorrowNightBright}>{codeStringRealtimeSocketIoSingleDevice}</SyntaxHighlighter>
            {/* <pre className="commanderBgPanel" >{ 'var socket = require("socket.io-client")("https://prototype.iotnxt.io");\n\nsocket.on("connect", function(data) {\n\tconsole.log("connected.");\n\tsocket.emit("join", "'+this.props.apikey+'"); // your api key\n\n\tsocket.on("post", data => {\n\t\tconsole.log(data);\n\t});\n});' }</pre> */}

            <p>Install the socket.io-client dependency from the same folder.</p>

            <pre className="commanderBgPanel" >$ npm install socket.io-client</pre>

            <p>Run it from the command line.</p>

            <pre className="commanderBgPanel" >$ node test.js<br />
              connected.
            </pre>

            <p>Now test it by sending some data from a device. You should see the data appear in your terminal.</p>

            <p className="commanderBgPanel" id="postSample" >{curlPostSample}</p>


            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>{codeStringRealtimeSocketIoResult}</SyntaxHighlighter>

            <h4>SENDING DATA</h4>
            
            <p>Once socket.io is connected and you've "joined" using your api key you can start sending data aswell. The format of the packet is identical to the HTTP REST post method.</p>

            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>{'socket.emit("post", {id: "yourDevice001", data: { temperature: 25.0 } } )'}</SyntaxHighlighter>
          </div>
        </div>


        <div className="row" style={this.getMenuPageStyle(4)}>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot">MQTT</h4>
            <p>This code example is for nodejs users, but should be similar for other mqtt clients</p>

            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>
              { "var mqtt = require('mqtt');\nvar config = { apikey: \""+this.props.apikey+"\" };\nvar client  = mqtt.connect('mqtt://"+window.location.host+"', {username:\"api\", password:\"key-\"+config.apikey});\n\nclient.on('connect', function () {\n\tconsole.log(\"connected.\");\n\n\tclient.subscribe(config.apikey, function (err) {\n\t\tif (err) { console.log(err) }\n\t\tconsole.log(\"subscribed.\")\n\t})\n\n\tsetInterval(()=>{\n\t\tclient.publish(config.apikey, JSON.stringify({id:\"mqttDevice01\", data: { a: Math.random() }}) );\n\t},1000)\n})\n\nclient.on('message', function (topic, message) {\n\tconsole.log(message.toString())\n})"}
            </SyntaxHighlighter>
          </div>
        </div>




        <div className="row" style={this.getMenuPageStyle(5)}>
          <div className="col-md-12 commanderBgPanel" >
            <h4 className="spot">Python</h4>
            <p>This code example is for nodejs users, but should be similar for other mqtt clients</p>

            <SyntaxHighlighter language="javascript" style={tomorrowNightBright}>
              { "var mqtt = require('mqtt');\nvar config = { apikey: \""+this.props.apikey+"\" };\nvar client  = mqtt.connect('mqtt://"+window.location.host+"', {username:\"api\", password:\"key-\"+config.apikey});\n\nclient.on('connect', function () {\n\tconsole.log(\"connected.\");\n\n\tclient.subscribe(config.apikey, function (err) {\n\t\tif (err) { console.log(err) }\n\t\tconsole.log(\"subscribed.\")\n\t})\n\n\tsetInterval(()=>{\n\t\tclient.publish(config.apikey, JSON.stringify({id:\"mqttDevice01\", data: { a: Math.random() }}) );\n\t},1000)\n})\n\nclient.on('message', function (topic, message) {\n\tconsole.log(message.toString())\n})"}
            </SyntaxHighlighter>
          </div>
        </div>


      </div>
    );
  }
}
