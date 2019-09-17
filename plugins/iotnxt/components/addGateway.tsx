import React, { Component } from "react";

interface GatewayProps {
    update: Function
}

interface GatewayState {

}

export class AddGatewayPanel extends React.Component<GatewayProps, GatewayState> {
    presets = {
        dev: {
            HostAddress: "greenqueue.dev.iotnxt.io",
            PublicKey: "<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>qblcqOI90QOdJk9pegGE+LDfXgMveZGpDBPpyIsSl8+Zkcp5zWxYj3k6BoWoL3U2z7l3wan6U9IhtAqaeTFatdwBOx0vOK8DWr4RIp1n6nAO7jEaHgsA1+FmFZTc8hQw6OEXVi+b31b7EFwLau0UA4TCj5862akf21ZqxaXmQUyyQA9Nl4JggY+TZDFL+hj+JdIm0V/yzq6o90E57s/70WYoDT6fZ5nDfdAgom/ZwjeUGTUh8V5HYJWuTZ33rRbKa8zYQ/HzAf5FZAVhndGI+CJFvorG8p53wXn2LP7NPhX6chCa++DVbFdru3OCLYMzdBqpohoVwHZnGGX1SGVi0Q==</Modulus></RSAKeyValue>"
        },
        prod: {
            HostAddress: "greenqueue.prod.iotnxt.io",
            PublicKey: "<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>"
        }
    }

    state = {
        addGatewayForm: {
            GatewayId: "gateway",
            Secret: generateDifficult(16),
            HostAddress: "greenqueue.prod.iotnxt.io",
            PublicKey: "<RSAKeyValue><Exponent>AQAB</Exponent><Modulus>rbltknM3wO5/TAEigft0RDlI6R9yPttweDXtmXjmpxwcuVtqJgNbIQ3VduGVlG6sOg20iEbBWMCdwJ3HZTrtn7qpXRdJBqDUNye4Xbwp1Dp+zMFpgEsCklM7c6/iIq14nymhNo9Cn3eBBM3yZzUKJuPn9CTZSOtCenSbae9X9bnHSW2qB1qRSQ2M03VppBYAyMjZvP1wSDVNuvCtjU2Lg/8o/t231E/U+s1Jk0IvdD6rLdoi91c3Bmp00rVMPxOjvKmOjgPfE5LESRPMlUli4kJFWxBwbXuhFY+TK2I+BUpiYYKX+4YL3OFrn/EpO4bNcI0NHelbWGqZg57x7rNe9Q==</Modulus></RSAKeyValue>"
        },
        message: ""
    }

    changeInput = (name) => {
        return (evt) => {
            var addGatewayForm = { ...this.state.addGatewayForm }
            addGatewayForm[name] = evt.target.value
            this.setState({ addGatewayForm })
        }
    }

    choosePreset = (name) => {
        return (evt) => {
            var addGatewayForm = { ...this.state.addGatewayForm }
            addGatewayForm.HostAddress = this.presets[name].HostAddress
            addGatewayForm.PublicKey = this.presets[name].PublicKey
            this.setState({ addGatewayForm })
        }
    }

    addGateway = () => {
        // console.log(this.state)

        fetch('/api/v3/iotnxt/addgateway', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.addGatewayForm)
        }).then((response) => {
            if (!response.ok) {
                this.setState({ message: "ERROR:" + response.status + " " + response.statusText })
            } else {
                return response.json()
            }
        }).then((data) => {
            console.log(data);
            if (data.err) {
                this.setState({ message: "ERROR:" + data.err })
                return;
            }
            if (this.props.update) { this.props.update(); }
        }).catch(
            (err) => {
                // console.log("------")
                // console.error(err.toString());
                // this.setState({ message: err.toString() })
            }
        )

    }

    render() {
        var formLabelStyle: any = { textAlign: "right", padding: "15px 3px 0 0" }
        var formInputStyle = { padding: 4, marginTop: "10px" }
        var formRowStyle = { marginRight: 20 }
        return (
            <div style={{
                border: "1px solid rgba(0,0,0,0.1)", boxSizing: "border-box",
                background: "rgba(0,0,0,0.2)",
                margin: 0,
                padding: 20
            }}>

                <h4>ADD GATEWAY</h4>

                <div className="row" style={formRowStyle} >
                    <div className="col-4 alignLeft" style={formLabelStyle} >
                        GatewayId:
                    </div>
                    <div className="col-8" style={formInputStyle}>
                        <input
                            style={{ width: "100%" }}
                            placeholder={this.state.addGatewayForm.GatewayId}
                            onChange={this.changeInput("GatewayId")}
                            autoFocus={true}
                        />
                    </div>
                </div>

                <div className="row" style={formRowStyle} >
                    <div className="col-4 alignLeft" style={formLabelStyle} >
                        Secret:
              </div>
                    <div className="col-8" style={formInputStyle}>
                        <input
                            style={{ width: "100%" }}
                            value={this.state.addGatewayForm.Secret}
                            onChange={this.changeInput("Secret")}
                        />
                    </div>
                </div>

                <div className="row" style={formRowStyle} >
                    <div className="col-4 alignLeft" style={formLabelStyle} >
                        <div style={{ marginTop: 6 }}>Presets: </div>
                    </div>
                    <div className="col-4" style={formInputStyle}>
                        <div className="smallButton" onClick={this.choosePreset("dev")} >DEVELOPMENT</div>
                    </div>
                    <div className="col-4" style={formInputStyle}>
                        <div className="smallButton" onClick={this.choosePreset("prod")}>PRODUCTION</div>
                    </div>
                </div>

                <div className="row" style={formRowStyle} >
                    <div className="col-4 alignLeft" style={formLabelStyle} >
                        Host address:
                    </div>
                    <div className="col-8" style={formInputStyle}>
                        <input
                            style={{ width: "100%" }}
                            value={this.state.addGatewayForm.HostAddress}
                            onChange={this.changeInput("HostAddress")}
                        />
                    </div>
                </div>

                <div className="row" style={formRowStyle} >
                    <div className="col-4 alignLeft" style={formLabelStyle} >
                        Public key:
                    </div>
                    <div className="col-8" style={formInputStyle}>
                        <input
                            style={{ width: "100%" }}
                            value={this.state.addGatewayForm.PublicKey}
                            onChange={this.changeInput("PublicKey")}
                        />
                    </div>
                </div>


                <div className="row" style={formRowStyle} >
                    <div className="col-4" style={formLabelStyle} ></div>
                    <div className="col-8" style={formInputStyle}>
                        <div className="commanderBgPanel commanderBgPanelClickable"
                            onClick={this.addGateway}>
                            <i className="fas fa-plus"></i> ADD GATEWAY</div>
                        <div style={{ padding: 7 }}>{this.state.message}</div>
                    </div>
                </div>



            </div>
        )
    }
}

function generateDifficult(count) {
    var _sym = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    var str = '';
    for (var i = 0; i < count; i++) {
        var tmp = _sym[Math.round(Math.random() * (_sym.length - 1))];
        str += "" + tmp;
    }
    return str;
}