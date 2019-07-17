import { confirmAlert } from 'react-confirm-alert';
import React, { Component } from "react";
import Modal from 'react-modal';
import Media from "react-media";
var loggedInUser = "";
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        background: "rgba(3, 4, 5,0.6)",
        maxHeight: 'calc(100vh - 210px)',
        overflow: 'auto'
    },
    overlay: {
        background: "rgba(27, 57, 77,0.9)",
    }
};

const customStylesMobile = {
    content: {
        top: '50%',
        left: '50%',
        right: '50%',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: "none",
        background: "rgba(3, 4, 5,0.6)",
        maxHeight: 'calc(100vh - 210px)',
        overflow: 'auto',
        width: "100%"
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
        userSearched: "Search For users above",
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

    handleActionCall = (clickdata) => {
        var newEmailList = _.clone(this.state.userSearched)
        var temp = [];
        for (var dev in newEmailList) {
            if (newEmailList[dev] == clickdata) {
                if (clickdata.selected == "deselected") {
                    newEmailList[dev].selected = "selected";
                    newEmailList[dev].icon = "fas fa-check-square";
                }
                else {
                    newEmailList[dev].selected = "deselected";
                    newEmailList[dev].icon = "far fa-square";
                }
                temp = newEmailList.filter((users) => { return users.selected !== "deselected" })
                this.state.SelectedUsers = _.clone(temp)
            }
        }
        this.setState({ userSearched: newEmailList })
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
        this.setState({ search: evt.target.value.toString() }, () => {
            var temp = [];
            var newDeviceList = [];
            var statsl = this.state.stats.userList;
            for (var i in statsl) {
                statsl[i].icon = "far fa-square"
            }
            statsl.map((person, i) => {
                temp = [...temp, person.email]
                if (person.email.toLowerCase().includes(this.state.search.toLowerCase())) {
                    newDeviceList.push(person);
                } else {
                    newDeviceList.push("|");
                }
            });
            temp = newDeviceList.filter((users) => { return users !== "|" && users.email !== this.props.account.email && users.username !== this.props.account.username })
            for (var look in this.state.shared) {
                for (var i in temp) {
                    if (temp[i].sharekey == this.state.shared[look]) {
                        temp[i].shared = "yes"
                    }
                }
            }
            this.setState({ userSearched: temp })
        })
    }

    userNameList = () => {
        try {
            return (<div style={{ height: "200px", overflow: "auto" }}>
                {
                    this.state.userSearched.map((user, i) => {

                        if (window.innerWidth <= 599) {
                            if (i < 10) {
                                if (user.shared == "no") {
                                    return <div id={user.email} key={i} className="commanderBgPanel commanderBgPanelClickable" style={{ display: this.state.checkboxstate }}>{user.email} <i className={user.icon} style={{ float: "right" }} onClick={(e) => this.handleActionCall(user)} /></div>
                                }
                                else {
                                    return <div id={user.email} key={i} className="commanderBgPanel commanderBgPanelClickable" style={{ display: this.state.checkboxstate }}>{user.email} <div style={{ float: "right" }} onClick={(e) => this.unshare(user.sharekey)}>Revoke Sharing </div></div>
                                }
                            }
                        }
                        else if (window.innerWidth > 599) {

                            if (user.shared == "no") {
                                return <div id={user.email} key={i} className="commanderBgPanel commanderBgPanelClickable" style={{ display: this.state.checkboxstate }}>{user.email} <i className={user.icon} style={{ float: "right" }} onClick={(e) => this.handleActionCall(user)} /></div>
                            }
                            else {
                                return <div id={user.email} key={i} className="commanderBgPanel commanderBgPanelClickable" style={{ display: this.state.checkboxstate }}>{user.email} <div style={{ float: "right" }} onClick={(e) => this.unshare(user.sharekey)}>Revoke Sharing </div></div>
                            }
                        }
                    })

                }
            </div >)
        } catch (err) { }
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
        if (this.props.type) {
            if (this.state.SelectedUsers.length > 0) {
                return (
                    <div className="protoButton"
                        onClick={this.shareDevice} style={{ float: "right", cursor: "pointer" }}> <i className="fas fa-share-alt" /> SHARE DEVICE(s)</div>
                )
            } else {
                return (
                    <div className="protoButton" style={{ opacity: 0.3, cursor: "not-allowed", float: "right" }} ><i className="fas fa-share-alt" />  SHARE DEVICE(s)</div>
                )
            }
        }
        else if (!this.props.type) {
            if (this.state.SelectedUsers.length > 0) {
                return (
                    <div className="protoButton"
                        onClick={this.shareDevice} style={{ float: "right", cursor: "pointer" }}> <i className="fas fa-share-alt" /> SHARE DEVICE</div>
                )
            } else {
                return (
                    <div className="protoButton" style={{ opacity: 0.3, cursor: "not-allowed", float: "right" }} ><i className="fas fa-share-alt" />  SHARE DEVICE</div>
                )
            }
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


    render() {
        return (<div ><center>
            {this.setValues(this.props.isOpen)}
            <Media query="(max-width: 599px)">
                {matches =>
                    matches ? (
                        <Modal style={customStylesMobile} isOpen={this.props.isOpen} onRequestClose={this.toggle}>
                            <i className={"fas fa-times " + this.state.show} onClick={() => { this.props.closeModel(this.state.qresponse); count = 0; }} style={{ color: "red" }}></i>
                            <center style={{ color: "white", display: this.state.checkboxstate }}>
                                <br></br> Search For users to share  with<br></br>
                                <div style={{ color: "white" }}><i className="fas fa-search" style={{ color: "white" }}></i> <input type="text" name="search" placeholder=" By email" onChange={this.search} /></div></center><br></br>
                            <br></br>{this.DevicePublic()}<div>
                                {this.ShareButton()}</div><hr></hr>
                            <br></br>{this.selectedUserCount()}<div>
                                {this.userNameList()}
                            </div>
                            <center>
                            </center>
                        </Modal>
                    ) : (
                            <Modal style={customStyles} isOpen={this.props.isOpen} onRequestClose={this.toggle}>
                                <i className={"fas fa-times " + this.state.show} onClick={() => { this.props.closeModel(this.state.qresponse); count = 0; }} style={{ color: "red" }}></i>
                                <center style={{ color: "white", display: this.state.checkboxstate }}>
                                    <br></br> Search For users to share  with<br></br>
                                    <div style={{ color: "white" }}><i className="fas fa-search" style={{ color: "white" }}></i> <input type="text" name="search" placeholder=" By email" onChange={this.search} /></div></center><br></br>
                                <br></br>{this.DevicePublic()}<div>
                                    {this.ShareButton()}</div><hr></hr>
                                <br></br>{this.selectedUserCount()}<div>
                                    {this.userNameList()}
                                </div>
                                <center>
                                </center>
                            </Modal>
                        )
                }
            </Media>
        </center>
        </div >)
    }
}

