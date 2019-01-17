import React, { Component } from "react";

import "../prototype.scss"

export default class Footer extends React.Component {
  state = {}

  render() {
    return (
      <div style={{ margin: 40 }}>
      <div className="" >
        <div className="row">
          <div className="col-12" style={{ fontSize: "150%", userSelect: "none", textAlign:"right" }}>
            
            <a className="footerButton" href="https://discord.gg/rTQmvbT"><i className="fab fa-discord"></i></a>&nbsp;
            <a className="footerButton" href="https://github.com/IoT-nxt/prototype"><i className="fab fa-github"></i></a>
            
          </div>
          
        </div>
      </div> 
    </div>
    )
  }
}