import React, { Component } from "react";
export const name = "Efento";
var ip = require('ip');
export class SettingsPanel extends React.Component {

    render() {
        return (
            <div className="blockstyle">
                <h4>EFENTO</h4>

                <div className="blockstyle" style={{ marginBottom: 20 }}>
                    <h4>PUBLIC PORT</h4>
                    IP: {ip.address()}<br></br>
                    PORT: 5683
          <p>Set Efento device to connect to this public port, IP and set your efento devices token to your apikey then devices will be visible to your account.</p>
                </div>
            </div>
        );
    }
}
