import React, { Component, Suspense } from "react";
// const SyntaxHighlighter = import('react-syntax-highlighter');
// const tomorrowNightBright = import("react-syntax-highlighter/styles/hljs");

import { CodeBlock } from "../components/codeblock"
import { Menu } from "../components/menu"
import { api } from "../api"

import { DocsApikey } from "./docs/apikey"
import { color } from "../components/dashboard/options";
import { colors } from "../theme";
import { DocsHTTPS } from "./docs/https";

interface MyProps {
    page?: string
}

interface MyState {
    //[index: string]: any
}
export class Documentation extends React.Component<MyProps, MyState> {
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
        },
        background: colors.panels
    };

    handleCopyClipboard() {
        var textField = document.createElement("textarea");
        //textField.innerText = $("#postSample").html();
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
            return { display: "", background: this.state.background, padding: 20 }
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

        var authheader = 'Basic ' + Buffer.from("api:key-" + api.data.account.apikey).toString('base64')



        return (
            <div className="apiInfo" style={{ padding: colors.padding * 2 }} >
                <Menu active={this.props.page} config={{
                    theme: {
                        active: {
                            background: this.state.background
                        },
                        inactive: {
                            background: "#202020"
                        }
                    },
                    menuitems: [
                        { responsive: true, link: "/docs/apikey", icon: "key", text: "APIKEY", onClick: this.onClickMenuTab(1) },
                        { responsive: false, link: "/docs/http", text: "HTTP/S", onClick: this.onClickMenuTab(2) },
                        { responsive: false, link: "/docs/websocket", text: "WEBSOCKET", onClick: this.onClickMenuTab(3) },
                        { responsive: false, link: "/docs/mqtt", text: "MQTT", onClick: this.onClickMenuTab(4) }]
                }} />



                <div className="row" style={this.getMenuPageStyle(1)}>
                    <DocsApikey />
                </div>

                <div className="row" style={this.getMenuPageStyle(2)}>
                    <DocsHTTPS />
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
  socket.emit("join", "` + api.data.account.apikey + `"); // your api key

  // or subscribe to a specific device: 
  // socket.emit("join", "` + api.data.account.apikey + `|yourdevice001");

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
var config = { apikey: "` + api.data.account.apikey + `" };
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

