import React, { Component } from "react";

export class SetUsername extends React.Component {

    state = { available: false, username: undefined }

    componentDidMount() {

    }

    onChange = () => {
        return (evt) => {
            // var addGatewayForm = { ...this.state.addGatewayForm }
            // addGatewayForm[name] = evt.target.value

            console.log(evt.target.value);

            this.setState({ username: this.cleaner(evt.target.value) }, () => {
                this.checkUpdateUsername();
            })


        }
    }

    checkUpdateUsername = () => {
        fetch('/api/v3/account/checkupdateusername', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username })
        }).then(response => response.json()).then((data) => {
            console.log(data);
            if (data.available == true) {
                this.setState({ available: true })
            } else {
                this.setState({ available: false })
            }
            //if (this.props.update) { this.props.update(); }
        }).catch(err => console.error(err.toString()))
    }

    showButton = () => {
        if (this.state.available == false) {
            return (<div>not available try a different username.</div>)
        } else {
            return ( <button onClick={this.updateUsername} className="btn-spot" style={{ float: "right" }} > SAVE</button> )
        }
    }

    updateUsername = () => {
        console.log("click!")
        fetch('/api/v3/account/updateusername', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username })
        }).then(response => response.json()).then((data) => {
            console.log(data);
            this.props.usernameUpdated();
            
        }).catch(err => console.error(err.toString()))
    }

    render() {

        if (this.props) {
            if (this.state.username == undefined) {
                if (this.props.username) {
                    this.setState({ username: this.props.username });
                }
            }
        }

        return (
            <div>
                <h3> Username </h3>
                <p>Here you can change your public username. This must be unique across the system. It will affect your public url in the form of /u/username</p>
                <input
                    style={{ width: "50%" }}
                    value={this.state.username}
                    onChange={this.onChange()}
                    autoFocus={true}
                />
                {this.showButton()}
            </div>
        )
    }

    cleaner(str) {
        var strLower = str.toLowerCase();
        return strLower.replace(/\W/g, '');
    }
}


