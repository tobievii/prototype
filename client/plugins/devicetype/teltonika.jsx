import React from "react";

export const name = "Teltonika";

export class AddDevice extends React.PureComponent {

    state = {
        teltonikaServiceEnabled: false,
        port: undefined
    }

    componentWillMount = () => {
        this.updateFromServer();
    }

    updateFromServer = () => {
        fetch("/api/v3/teltonika/info")
            .then(res => res.json())
            .then((result) => {
                if (result.port) {
                    this.setState({ port: result.port })
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    enable = () => {
        fetch("/api/v3/teltonika/reqport")
            .then(res => res.json())
            .then((result) => {
                if (result.port) {
                    this.setState({ port: result.port });
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    render() {
        return (
            <div className="blockstyle" style={{ background: "rgb(22, 32, 44)" }}>
                <h3>TELTONIKA</h3>
                <p>To add a device to Prototyp3, configure the device to forward its data to {window.location.origin}/port. Below is the different ports offered:</p>
                <h5>PUBLIC PORT</h5>
                DEFAULT PORT: 12000
                    <p>If you set Teltonika device to connect to this port devices will be visible to administrators only.
    Any user can type in IMEI to add device to their account.
                    </p>
                <h5>PUBLIC PORT</h5>
                To set a private port, navigate to <span className="commanderBgPanel">Settings -> Teltonika -> Click Enable</span> to get a private port assigned to your account.
                </div>
        );
    }
}