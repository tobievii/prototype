import React from "react";
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        // background: "rgba(23, 47, 64, 0.85)",
        background: "rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        maxHeight: 'calc(100vh - 210px)',
        overflowY: 'auto',
        padding: "0",
        width: "765px",
        height: "437px"
    },
    //bacground of Pop up Modal on search
    overlay: {
        background: "rgba(23, 47, 64, 0.9)",
        zIndex: 1002
    }
};

export class ChangeUsername extends React.Component {

    state = {
        available: false,
        username: undefined,
        message: "",
        isOpen: false
    }

    componentDidMount() {
    }

    onChange = () => {
        return (evt) => {
            this.setState({ username: this.cleaner(evt.target.value) }, () => {
                this.checkUpdateUsername();
            })
        }
    }

    cleaner(str) {
        var strLower = str.toLowerCase();
        return strLower.replace(/[^a-zA-Z0-9]/g, '');
    }

    openModal = (origination) => {
        this.setState({ isOpen: true });
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
            if (data.available == true) {
                this.setState({ available: true })
            } else {
                this.setState({ available: false })
            }
        }).catch(err => console.error(err.toString()))
    }

    showButton = () => {
        if (this.state.available == false || this.state.username == "") {
            return (<div><br />not available try a different username.</div>)
        } else {
            return (<span><button onClick={this.updateUsername} className="btn-spot" style={{ float: "right" }} > SAVE</button> <br /><br /> <br /></span>)
        }
    }

    updateUsername = () => {
        fetch('/api/v3/account/updateusername', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: this.state.username })
        }).then(response => response.json()).then((data) => {
            this.props.closeModel();
        }).catch(err => console.error(err.toString()))
    }

    cancelButton = () => {
        if (this.props.mainView == undefined || this.props.mainView == "settings") {
            return (
                <div className="col fas fa-times cross" style={{ flex: "0 0 40px", padding: "10px 7px 0px 13px", fontSize: "20px", margin: 10 }} onClick={() => { this.props.closeModel(); }}></div>
            )
        } else return null
    }

    render() {
        return (
            <div style={{}}>
                <center>
                    <Modal style={customStyles} isOpen={this.props.isOpen}>
                        <div className="container-fluid" style={{ background: "#0E1A26" }}>
                            <div className="row">
                                <div className="col" style={{ fontSize: 27, padding: 10, color: "rgba(174, 231, 241, 0.55)" }}> Username </div>
                                {this.cancelButton()}
                            </div>
                        </div>
                        <div style={{ color: "rgb(174, 231, 241)", padding: "10px 20px" }}>
                            {/* <p>Here you can change your public username. This must be unique across the system. It will affect your public url in the form of /u/username</p> */}
                            <br /><p>Please change your username below.<br /> This must be unique across the system. It will affect your public url in the form of /u/username</p>
                            <br /><input
                                style={{ width: "50%" }}
                                value={this.state.username}
                                onChange={this.onChange()}
                                autoFocus={true}
                                placeholder={this.props.account.username}
                            />
                            {this.showButton()}<hr></hr>
                            <br /><br />
                        </div>

                        <div style={{ background: "#0E1A26", padding: "15px 30px", color: "rgba(174, 231, 241, 0.55)", textAlign: "right" }}>
                            Need help? Please contact our <span style={{ color: "red", opacity: 0.7 }}><a href="#">support</a></span>
                        </div>
                    </Modal>
                </center>
            </div>
        )
    }

}