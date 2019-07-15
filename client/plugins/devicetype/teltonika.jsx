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
            <div className="blockstyle">
                <h4>TELTONIKA</h4>

                <div className="blockstyle" style={{ marginBottom: 20 }}>
                    <h3>PUBLIC PORT</h3>
                    DEFAULT PORT: 12000
                    <p>If you set Teltonika device to connect to this port devices will be visible to administrators only.
                        Any user can type in IMEI to add device to their account.
                    </p>
                    To set a port, go to <span className="commanderBgPanel">Settings -> Teltonika -> Click Enable</span> to get a private port assigned to your account.
                </div>

            </div>
        );
    }
}