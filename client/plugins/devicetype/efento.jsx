import React from "react";

export const name = "Efento";

export class AddDevice extends React.PureComponent {

    render() {
        return (
            <div style={{ background: "#16202C", paddingLeft: "20px", paddingBottom: "45px" }}>
                <br></br>
                <h5>Efento NB-IoT</h5>
                <br />
                Please enter the information below on your efento logger mobile application.
                <br /><br />
                Prototyp3's IP Address: <span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">40.115.63.112</span></span>
                <br /><br />
                Your API Key:<span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">{this.props.account.apikey}</span></span>
                <br /><br />
                Port: <span className="commanderBgPanel" style={{ float: "right", width: "60%", marginRight: "15px", textAlign: "center" }}><span className="spot">5683</span></span>
            </div>
        )
    }
}