import React from "react";

export const name = "Teltonika";

class TeltonikaConfigure extends React.PureComponent {
    state = {
        form: {
            port: ""
        }
    }

    changeInput = name => {
        return evt => {
            var form = { ...this.state.form };
            form[name] = evt.target.value;
            this.setState({ form });
        };
    };

    enable = () => {
        if (this.props.enable) {
            this.props.enable();
        }
    }

    enableButton = () => {
        if (this.props.port) {
            return (<div className="commanderBgPanel" style={{ float: "left" }}
            > <i className="fas fa-check-circle" style={{ color: "#11cc88" }}></i> PORT IS ACTIVE: {this.props.port} </div>)
        } else {
            return (<div className="commanderBgPanel commanderBgPanelClickable"
                style={{ float: "left" }}
                onClick={this.enable}>
                <i className="fas fa-play-circle" style={{ color: "#11cc88" }}></i> ENABLE</div>)
        }
    }

    render() {
        return (
            <div className="blockstyle">
                <h4>PRIVATE PORT</h4>
                <p>A private port for Teltonika devices will bind a server port to your account so all devices pointed to this port will automatically be added to your account.</p>
                {this.enableButton()}
                <div style={{ clear: "both" }}></div>
            </div>
        )
    }
}

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

                <div className="blockstyle" style={{ marginBottom: 20, display: "none" }}>
                    <h4>PUBLIC PORT</h4>
                    DEFAULT PORT: 12000
                    <p>If you set Teltonika device to connect to this port devices will be visible to administrators only.
                        Any user can type in IMEI to add device to their account.
                    </p>
                </div>

                <TeltonikaConfigure enable={this.enable} port={this.state.port} />
            </div>
        );
    }
}