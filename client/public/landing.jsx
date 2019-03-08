import React, { Component } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export class Landing extends Component {
  previewDevices = () => {
    fetch("/api/v3/preview/publicdevices", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
    }).then(response => response.json()).then(serverresponse => {
    }).catch(err => console.error(err.toString()));
  }
  componentDidMount = () => {
    this.previewDevices();
  }
  render() {
    return (

      <div>

        <div style={{ backgroundImage: "url(/splash.jpg)", backgroundSize: "100% auto", minHeight: "500px", backgroundPositionY: "center" }}>
          <div className="container" >
            <div className="row">
              <div className="col-sm-5" style={{ color: "#173748", background: "rgba(255,255,255,0.95)", marginTop: 100, padding: 20, marginLeft: 20 }}>
                <h1>Internet of Things for everyone</h1>
                <p>A new IoT solution with the goal of taking down the barriers to connecting devices to the cloud.</p>
              </div>
              <div className="col-sm-7">

              </div>
            </div>
          </div>
        </div>

        <div style={{}}>
          <div className="container">
            <div className="row">
              <div className="col-md-7" style={{}}>
                <img src="/screenshot.png" width="100%" style={{ border: "1px solid rgba(0,0,0,0.5)", borderRadius: "1px", imageRendering: "high-quality", margin: "50px 0 50px 0", boxSizing: "border-box", boxShadow: "0px 25px 39px 1px rgba(0,0,0,0.05)" }} />
              </div>
              <div className="col-md-5" style={{ paddingTop: 75 }}>

                <ul style={{ marginBottom: 50 }}>

                  <li>Simple as possible to connect your devices.</li>
                  <li>Multi protocol support: HTTP/S, MQTT, socketio, raw TCP, USB serialports and more.</li>
                  <li><a href="https://github.com/IoT-nxt/prototype">Opensource</a> so you can be sure what happens with your data.</li>
                  <li>Runs on windows/mac/linux, in the cloud or even a raspberry pi.</li>
                  <li>Fast mongodb for the data.</li>
                  <li>Extendable plugin architecture.</li>
                  <li>Edit code in the browser using the VSCode editor with intellisense autocompletion and deploy custom code instantly.</li>
                </ul>

              </div>

            </div>
          </div>
        </div>

      </div>

    )
  }
}