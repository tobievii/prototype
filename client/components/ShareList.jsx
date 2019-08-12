import { confirmAlert } from 'react-confirm-alert';

import React, { Component } from "react";
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
        background: "rgb(23, 35, 43)",
        maxHeight: 'calc(100vh - 210px)',
        overflow: 'auto',
        padding: 0
    },
    overlay: {
        background: "rgba(27, 57, 77,0.9)",
    }
};


var count = 0;
export class ShareList extends Component {
    state = {

        devid: this.props.devid,
        lastTimestamp: "no idea",
        packets: [],
        socketDataIn: {},
        getPackets: false,
        trashClicked: 0,
        trashButtonText: "DELETE DEVICE",
        clearStateClicked: 0,
        eraseButtonText: "CLEAR STATE",
        sharebuttonText: "SHARE DEVICE",
        view: undefined,
        apiMenu: 1,
        isOpen: false,
        stats: {},
        tempstat: [],
        search: "",
        userSearched: [],
        SelectedUsers: [],
        DeviceSharedEmails: [],
        EmailsharedDevice: [],
        display: "",
        EditorButton: " SHOW EDITOR",
        shareDisplay: "",
        editorChanged: false,
        devicesServer: undefined,
        shared: [],
        Devicestate: "SHARE PUBLICLY",
        DevicestateIcon: "fas fa-globe-africa",
        checkboxstate: "",
        qresponse: { mail: "failed" },
        show: " ",
        showselected: "none"
    };

    componentDidMount = () => {
        Modal.setAppElement('body');
    }

    handleActionCall(clickuser) {
        return (evt) => {
            var devicekeys = _.map(_.clone(this.props.chosen), "key");

            if (clickuser.sharedCount == this.props.chosen.length) {
                fetch("/api/v3/unshare", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ devicekeys, userkeys: [clickuser.publickey] })
                }).then(response => response.json()).then(result => {
                    //update list to show shared with user
                    var updatedUserlist = _.clone(this.state.userSearched);
                    for (var user of updatedUserlist) {
                        if (user.publickey == clickuser.publickey) {
                            user.shared = false;
                            user.sharedCount = 0;
                            console.log("user marked unshared")
                        }
                    }
                    this.setState({ userSearched: updatedUserlist })
                }).catch(err => console.error(err.toString()));
            } else {
                fetch("/api/v3/share", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ devicekeys, userkeys: [clickuser.publickey] })
                }).then(response => response.json()).then(result => {
                    //update list to show shared with user
                    var updatedUserlist = _.clone(this.state.userSearched);
                    for (var user of updatedUserlist) {
                        if (user.publickey == clickuser.publickey) {
                            user.shared = true;
                            user.sharedCount = this.props.chosen.length
                            console.log("user marked shared")
                        }
                    }
                    this.setState({ userSearched: updatedUserlist })
                }).catch(err => console.error(err.toString()));
            }
        }
    }

    unshare = (remove) => {
        if (!this.props.type) {
            this.setState({ show: "noDisplayShare" });
            for (let i in this.state.userSearched) {
                if (remove == this.state.userSearched[i].sharekey) {
                    this.state.userSearched[i].shared = "no";
                }
            }
            fetch("/api/v3/unshare", {
                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ removeuser: remove, dev: this.props.devid })
            }).then(response => response.json()).then(stats => {
                this.setState({ stats: stats })
                this.setState({ qresponse: { mail: "sent" } })
                this.setState({ show: " " });
            }).catch(err => console.error(err.toString()));
        }
        else return
    }

    setValues = (isOpen) => {

        if (isOpen == true && count == 0) {
            count++;
            if (this.props.type) {
                var temp = []
                fetch("/api/v3/stats", {
                    method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
                }).then(response => response.json()).then(stats => {
                    this.setState({ stats: stats })
                }).catch(err => console.error(err.toString()));
                temp = this.props.chosen.filter((users) => { return users.public == true && users.public })
                if (temp.length > 0) {
                    this.setState({ checkboxstate: "none" })
                    this.setState({ Devicestate: "UNSHARE PUBLICLY" })
                }
            }

            else if (!this.props.type) {
                fetch("/api/v3/stats", {
                    method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
                }).then(response => response.json()).then(stats => {
                    this.setState({ stats: stats })
                    Modal.setAppElement('body');
                    fetch("/api/v3/state", {
                        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                        body: JSON.stringify({ id: this.props.devid, username: this.props.username })
                    }).then(response => response.json()).then(state => {
                        this.setState({ state })
                        if (this.state.state.public == true) {
                            this.setState({ checkboxstate: "none" })
                            this.setState({ Devicestate: "UNSHARE PUBLICLY" })
                        }
                        this.sharedList();
                        this.setState({ devid: this.props.devid })
                    }).catch(err => console.error(err.toString()));
                }).catch(err => console.error(err.toString()));
            }
        }
    }



    search = evt => {

        fetch("/api/v3/allUsers", {
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ search: evt.target.value.toString() })
        }).then(response => response.json()).then(users => {
            if (!users) { return; }
            if (users.error) { this.setState({ error: users.error }); return; }

            // marks users if shared to already

            for (var user of users) {
                user.shared = false;
                user.sharedCount = 0;
                for (var device of this.props.chosen) {
                    if (device.access) {
                        for (var access of device.access) {
                            if (access == user.publickey) { user.sharedCount += 1; }
                        }
                    }
                }
            }

            this.setState({ userSearched: users })


        }).catch(err => console.error(err.toString()));

    }

    userNameList = () => {
        if (!this.state.userSearched) { return; }
        return (<div style={{ overflow: "auto" }}>
            {
                this.state.userSearched.map((user, i) => {

                    // full shared
                    if (user.sharedCount == this.props.chosen.length) {
                        return (
                            <div key={i} className="commanderBgPanel commanderBgPanelClickable" onClick={this.handleActionCall(user)} style={{ padding: "3px 7px 7px 5px" }}>
                                <i className="statesViewerCheckBoxes fas fa-check" style={{ width: 28, color: "rgba(125, 255, 175, 1)", paddingRight: 10, filter: "drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.35))", fontSize: 14 }}></i>
                                {user.username} ({user.sharedCount}/{this.props.chosen.length})
                            </div>
                        )
                    } else if (user.sharedCount > 0) {
                        return (
                            <div key={i} className="commanderBgPanel commanderBgPanelClickable" onClick={this.handleActionCall(user)} style={{ padding: "3px 7px 7px 5px" }}>
                                <i className="statesViewerCheckBoxes fas fa-check" style={{ width: 28, color: "rgba(125, 255, 175, 0.25)", paddingRight: 10, filter: "drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.35))", fontSize: 14 }}></i>
                                {user.username} ({user.sharedCount}/{this.props.chosen.length})
                            </div>
                        )
                    } else if (user.sharedCount == 0) {
                        return (
                            <div key={i} className="commanderBgPanel commanderBgPanelClickable" onClick={this.handleActionCall(user)} style={{ padding: "3px 7px 7px 5px" }}>
                                <i className="statesViewerCheckBoxes fas fa-square" style={{ width: 28, fontSize: 14, color: "rgb(42, 53, 62)", paddingRight: 10 }}></i>
                                {user.username} ({user.sharedCount}/{this.props.chosen.length})
                            </div>)
                    }
                })
            }
        </div >)
    }


    emailsEmailedWith = () => {
        try {
            return (<div>
                {
                    this.state.EmailsharedDevice.map((user, i) => {
                        return <div id={user.email} className="" style={{ color: "rgb(127,255,0)" }}> |{user.email}|<input type="checkbox" style={{ float: "right" }} />  </div>
                    })
                }
            </div>)
        } catch (err) { }
    }

    sharedList = () => {
        fetch("/api/v3/shared", {
            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ dev: this.state.devid, })
        }).then(response => response.json()).then(states => {

            if (states.access) {
                var shared = _.clone(states.access)
                this.setState({ shared })
            }
        })
    }

    ShareButton = () => {
        if (this.state.userSearched.filter((user) => { return user.shared }).length > 0) {
            return (
                <div className="commanderBgPanel commanderBgPanelClickable"
                    onClick={this.shareDevice} style={{ float: "right", cursor: "pointer", marginRight: 10 }}> <i className="fas fa-share-alt" /> SHARE DEVICE(s)</div>
            )
        } else {
            return (
                <div className="commanderBgPanel" style={{ opacity: 0.3, cursor: "not-allowed", float: "right", marginRight: 10 }} ><i className="fas fa-share-alt" />  SHARE DEVICE(s)</div>
            )
        }

    }

    shareDevice = () => {
        var path = window.location.origin;
        if (this.props.type) {
            this.setState({ show: "noDisplayShare" });
            this.state.EmailsharedDevice = _.clone(this.state.SelectedUsers) //#region 
            for (let dev in this.state.EmailsharedDevice) {
                var htmlMessage =
                    '<p>' +
                    'Hi ' + this.state.EmailsharedDevice[dev].username +
                    ',<br></br>' +
                    '<a href="' + path + "/u/" + this.props.account.username + '">' + this.props.account.username + '</a>' + ' has shared devices:<br></br>' +
                    this.props.chosen.map((user) => { return (' -  ' + '<a href="' + path + '/u/' + this.props.account.username + '/view/' + user.devid + '">' + user.devid + '</a>' + '<br/>') }) +
                    '<br/>with you. </p>' +
                    '</p><br/>Kind Regards,<br/>Prototyp3<br/><br/>' +
                    '<a href="' + path + '"><img src="cid:nxtlogokkk" alt="Prototype3 Logo"/></a> <a href="https://github.com/IoT-nxt/prototype"><img src="cid:gitlogokkk" alt="Github Logo"/></a>';

                fetch("/api/v3/admin/shareDevice", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: this.state.EmailsharedDevice[dev].email,
                        text: 'Hi Device(s) have been shared with you ',
                        subject: 'SHARED DEVICE',
                        dev: this.props.chosen.map((user, i) => user.devid + ''),
                        type: "multi",
                        chosen: this.props.chosen,
                        person: this.props.account.username,
                        publickey: this.state.EmailsharedDevice[dev].sharekey,
                        html: htmlMessage,
                        attachments: [
                            {
                                filename: 'favicon.png',
                                path: '../public/favicon.png',
                                cid: "nxtlogokkk"
                            },
                            {
                                filename: 'githubLogo.png',
                                path: '../public/githubLogo.png',
                                cid: "gitlogokkk"
                            },
                        ]
                    })
                }).then(response => response.json()).then(serverresponse => {
                    this.setState({ qresponse: serverresponse.result })
                    this.setState({ show: " " });
                }).catch(err => console.error(err.toString()));
            }
            this.setState({ SelectedUsers: [] })
            this.setState({ isOpen: !this.state.isOpen })

        }
        else if (!this.props.type) {
            this.setState({ show: "noDisplayShare" });
            this.state.EmailsharedDevice = _.clone(this.state.SelectedUsers) //#region 
            for (let dev in this.state.EmailsharedDevice) {
                var htmlMessage =
                    '<p>' +
                    'Hi ' + this.state.EmailsharedDevice[dev].username +
                    ',<br></br>' +
                    '<a style={{ textDecoration: "none"}} href="' + path + "/u/" + this.props.username + '">' + this.props.account.username + '</a>' + ' has shared "' + '<a style={{ textDecoration: "none"}} href="' + path + "/u/" + this.props.username + "/view/" + this.props.devid + '">' + this.props.devid + '</a>' + '" with you.' +
                    '</p><br/>Kind Regards,<br/>Prototyp3<br/><br/>' +
                    '<a href="' + path + '"><img src="cid:nxtlogokkk" alt="Prototype3 Logo"/></a> <a href="https://github.com/IoT-nxt/prototype"><img src="cid:gitlogokkk" alt="Github Logo"/></a>';
                for (let i in this.state.userSearched) {
                    if (this.state.EmailsharedDevice[dev].email == this.state.userSearched[i].email) {
                        this.state.userSearched[i].shared = "yes";
                    }
                }
                fetch("/api/v3/admin/shareDevice", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: this.state.EmailsharedDevice[dev].email,
                        text: 'Hi a Device was shared with you called ' + this.props.devid,
                        subject: 'SHARED DEVICE',
                        dev: this.props.devid,
                        person: this.props.username,
                        publickey: this.state.EmailsharedDevice[dev].sharekey,
                        html: htmlMessage,
                        attachments: [
                            {
                                filename: 'favicon.png',
                                path: '../public/favicon.png',
                                cid: "nxtlogokkk"
                            },
                            {
                                filename: 'githubLogo.png',
                                path: '../public/githubLogo.png',
                                cid: "gitlogokkk"
                            },
                        ]
                    })
                }).then(response => response.json()).then(serverresponse => {
                    this.setState({ qresponse: serverresponse.result })
                    this.setState({ show: " " });
                }).catch(err => console.error(err.toString()));
            }
            this.setState({ SelectedUsers: [] })
            this.setState({ isOpen: !this.state.isOpen })
        }
    }


    publicOrprivate = () => {
        if (this.state.Devicestate == "SHARE PUBLICLY") {
            confirmAlert({
                customUI: ({ onClose }) => {
                    return (
                        <div className='protoPopup' align="center">
                            <h1>Are you sure?</h1>
                            <p>This will make device(s) visible to Anyone even unregistered vistors </p>
                            <button className="smallButton" style={{ margin: "5px" }} onClick={onClose}>No, Cancel it!</button>
                            <button className="smallButton" style={{ margin: "5px" }} style={{ margin: "15px" }} onClick={() => {
                                {
                                    if (this.props.type) {
                                        fetch("/api/v3/setprivateorpublic", {
                                            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                devid: this.props.chosen,
                                                type: "multi",
                                                public: true
                                            })
                                        }).then(response => response.json()).then(serverresponse => {
                                            if (serverresponse.nModified == 1) {
                                                for (var i in this.props.chosen) {
                                                    this.props.chosen[i].public = true
                                                }
                                                { onClose() }
                                                this.setState({ checkboxstate: "none" })
                                                this.setState({ Devicestate: "UNSHARE PUBLICLY" })
                                            }
                                            else { null }
                                        }).catch(err => console.error(err.toString()));

                                    }
                                    else if (!this.props.type) {
                                        fetch("/api/v3/setprivateorpublic", {
                                            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                devid: this.state.state.key,
                                                public: true
                                            })
                                        }).then(response => response.json()).then(serverresponse => {
                                            if (serverresponse.nModified == 1) {
                                                for (var i in this.props.chosen) {
                                                    this.props.chosen[i].public = true
                                                }
                                                { onClose() }
                                                this.setState({ checkboxstate: "none" })
                                                this.setState({ Devicestate: "UNSHARE PUBLICLY" })
                                            }
                                            else { null }
                                        }).catch(err => console.error(err.toString()));
                                    }
                                }
                            }}>Yes,Share Publicly!</button>
                        </div>
                    )
                }
            })
        }
        else if (this.state.Devicestate == "UNSHARE PUBLICLY") {
            if (this.props.type) {
                fetch("/api/v3/setprivateorpublic", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        devid: this.props.chosen,
                        type: "multi",
                        public: false
                    })
                }).then(response => response.json()).then(serverresponse => {
                    this.setState({ checkboxstate: "" })
                    this.setState({ Devicestate: "SHARE PUBLICLY" })
                }).catch(err => console.error(err.toString()));
            }
            else if (!this.props.type) {
                fetch("/api/v3/setprivateorpublic", {
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        devid: this.state.state.key,
                        public: false
                    })
                }).then(response => response.json()).then(serverresponse => {
                    this.setState({ checkboxstate: "" })
                    this.setState({ Devicestate: "SHARE PUBLICLY" })
                }).catch(err => console.error(err.toString()));
            }
        }
    }


    DevicePublic = () => {
        if (this.state.checkboxstate == "") {
            return (
                <div style={{ float: "right", cursor: "pointer" }} className="protoButton" onClick={this.publicOrprivate}><i className="fas fa-globe-africa" ></i> {this.state.Devicestate}</div>
            )
        }
        if (this.state.checkboxstate == "none") {
            return (
                <div style={{ float: "right", cursor: "pointer" }} className="protoButton" onClick={this.publicOrprivate}><i className="fa fa-eye-slash" ></i> {this.state.Devicestate}</div>
            )
        }
    }
    selected = () => {
        if (this.state.showselected == "none") {
            this.setState({ showselected: "" })
        }
        else if (this.state.showselected == "") {
            this.setState({ showselected: "none" })
        }
    }

    selectedUserCount = () => {
        if (this.state.SelectedUsers.length == 0) {
            return (
                null
            )
        }
        else {
            return (
                <div className="commanderBgPanel commanderBgPanelClickable" ><h4 onClick={this.selected}>SELECTED USERS ({this.state.SelectedUsers.length})</h4>
                    {this.selectedUsers()}
                </div>
            )
        }
    }

    selectedUsers = () => {
        return (<div>
            {
                this.state.SelectedUsers.map((user, i) => {
                    return <div id={user.email} key={i} style={{ display: this.state.showselected, color: "#f62636" }}>{user.email}</div>
                })
            }
        </div >)
    }

    onClose = () => {
        this.setState({ userSearched: [] })
        this.props.closeModel(this.state.qresponse); count = 0;
    }

    render() {
        if (!this.props) { return; }
        if (!this.props.chosen) { return <div style={{ display: "none" }}></div> }
        return (<div ><center>
            {this.setValues(this.props.isOpen)}

            <Modal style={customStyles} isOpen={this.props.isOpen} onRequestClose={this.onRequestClose}>

                <div className="container-fluid" style={{ background: "#16202C" }}>
                    <div className="row">
                        <div className="col" style={{ textAlign: "center", opacity: 0.8, padding: "7px", paddingBottom: "5px", fontSize: "18px" }}>SHARE</div>
                        <div className="col fas fa-times cross" onClick={this.onClose} style={{ flex: "0 0 40px", padding: "10px 8px 0px 12px", fontSize: "20px" }}></div>
                    </div>
                </div>

                <div style={{ padding: 20 }}>
                    <div style={{ width: "100%", paddingBottom: "10px" }}>Search For users to share {this.props.chosen.length} device(s) with:</div>

                    <div style={{ color: "white", paddingBottom: "10px" }}>

                        <div style={{ width: "30px", float: "left" }}>
                            <i className="fas fa-search" style={{ color: "white", paddingTop: "10px", paddingLeft: "5px" }}></i>
                        </div>

                        <div style={{ overflow: "hidden" }}>
                            <div>
                                <input type="text" name="search" placeholder="Partial Username or full email" onChange={this.search} style={{ width: "100%" }} />
                            </div>
                        </div>


                    </div>

                    {this.userNameList()}

                    {this.DevicePublic()}
                </div>





                {/* {this.ShareButton()}</div><hr></hr> */}
                {/* <br></br>{this.selectedUserCount()}<div> */}

            </Modal>
        </center>
        </div >)
    }
}

