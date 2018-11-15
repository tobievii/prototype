import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export class Landing extends Component {
  render() {
    return ( 

      <div>

      <div style={{background: "rgb(255,255,255)"}}>
        <div className="container">
          <div className="row">
            <div className="col-5" style={{color:"#173748"}}>
              <h1 style={{marginTop:100}}>Internet of Things for everyone</h1>
              <p>A new IoT solution with the goal of taking down the barriers to connecting devices to the cloud.</p>
            </div>
            <div className="col-7">
              <img src="http://images.ctfassets.net/vrkkgjbn4fsk/1lmaVge08sSOIi06m8eu2i/12286a869dc2ce996a6a01e1018d806a/Homepage_Hero.svg" />
            </div>
          </div>
        </div> 
      </div> 

      <div style={{ background: "#17293A" }}>
        <div className="container">
          <div className="row">
            <div className="col-12" style={{}}>
              <h1 style={{marginTop:50}}>Features</h1>
              
              <ul style={{marginBottom:50}}>
                
<li>Simple as possible to connect your devices. See /examples or the documentation below.</li>
<li>Multi protocol support: HTTP/S, MQTT, socketio, raw TCP, USB serialports and more.</li>
<li>Opensource so you can be sure what happens with your data.</li>
<li>Runs on windows/mac/linux, in the cloud or even a raspberry pi.</li>
<li>Fast mongodb for the data.</li>
<li>Extendable plugin architecture.</li>
<li>Edit code in the browser using the VSCode editor with intellisense autocompletion and deploy custom code instantly.</li>
              </ul>
              
            </div>
            
          </div>
        </div> 
      </div>

      <div style={{ paddingTop: 25 }}>
        <div className="container">
          <div className="row">
            <div className="col-12" style={{ fontSize: "150%", userSelect: "none" }}>
              
              <a className="footerButton" href="https://discord.gg/rTQmvbT"><i class="fab fa-discord"></i></a>&nbsp;
              <a className="footerButton" href="https://github.com/IoT-nxt/prototype"><i class="fab fa-github"></i></a>
              
            </div>
            
          </div>
        </div> 
      </div>

      </div>

    )
  }
}