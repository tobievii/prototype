
import React, { Component, Suspense } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "./prototype.scss"

import { NavBar } from "./components/navBar.jsx";
import { Account } from "./public/account.jsx"
// not logged in content:
import { Landing } from "./public/landing.jsx"
import { UserPage } from "./components/userpage.jsx"
import { Recovery } from "./public/recovery.jsx";
import { Encrypt } from "./public/encrypt.jsx";
// logged in content:
const ApiInfo = React.lazy(() => import('./components/apiInfo'))
const SettingsView = React.lazy(() => import('./components/settingsView'))
import AddDevice from './components/addDevice'

import { DeviceView } from "./components/deviceView.jsx";
import { StatesViewer } from "./components/statesViewer.jsx";
import { NotificationsView } from "./components/notificationsView.jsx";

const Stats = React.lazy(() => import("./components/stats"));
import Footer from "./public/footer.jsx"
import * as p from "./prototype.ts"

import socketio from "socket.io-client";
var socket = socketio({ transports: ['websocket', 'polling'] });
const publicVapidKey =
    "BNOtJNzlbDVQ0UBe8jsD676zfnmUTFiBwC8vj5XblDSIBqnNrCdBmwv6T-EMzcdbe8Di56hbZ_1Z5s6uazRuAzA";

const test = {
    un: undefined,
    acc: undefined,
    dc: undefined,
    ds: undefined
}

var visitingG = undefined;

class App extends Component {
    state = {
        devicesView: "dashboardDevices",
        isOpen: false,
        isOpen2: false,
        registrationPanel: false,
        loginPanel: false,
        public: undefined,
        visituser: undefined
    };

    constructor(props) {
        super(props);

        p.getVersion((version) => { this.setState({ version: version.version.toUpperCase() }); })

        socket.on("connect", a => {
            socket.on("notification", a => {
                p.getAccount(account => {
                    this.setState({ account });
                })
            })

        });

        p.getStates((states) => { this.setState({ states }) })

        this.serviceworkerfunction();

    }


    componentWillMount = () => {
        p.getAccount(account => {
            this.setState({ account });
            if (account.level > 0) {
                socket.emit("join", account.apikey);
                this.setState({ loggedIn: true })
                this.setState({ public: false })
            } else {
                this.setState({ public: true })
            }
        })
    }

    serviceworkerfunction = () => {
        if ('serviceWorker' in navigator) {
            if (supportsServiceWorkers(location, navigator)) {
                workerInit().catch(err => console.error(err));
            }
        }

        function supportsServiceWorkers(location, navigator) {
            if (location.hostname === `localhost` || location.protocol === `https:`) {
                return `serviceWorker` in navigator
            }
            return false
        }

        async function workerInit() {
            const register = await navigator.serviceWorker.register('/serviceworker.js', {
                scope: "/"
            });

            socket.on("pushNotification", a => {
                var message = " ";

                if (a.message == undefined || a.message == null) {
                    if (a.type == "NEW DEVICE ADDED" || a.type == "New dewvice added") {
                        message = "has been successfuly added to PROTOTYP3.";
                    } else if (a.type == "CONNECTION DOWN 24HR WARNING") {
                        message = "hasn't sent data in the last 24hours";
                    }
                } else {
                    message = a.message;
                }

                register.showNotification(a.type, {
                    body: '"' + a.device + '" ' + message,
                    icon: "./iotnxtLogo.png"
                });
            })

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            await fetch("/api/v3/iotnxt/subscribe", {
                method: "POST",
                body: JSON.stringify(subscription),
                headers: {
                    "content-type": "application/json"
                }
            });
        }

        function urlBase64ToUint8Array(base64String) {
            const padding = "=".repeat((4 - base64String.length % 4) % 4);
            const base64 = (base64String + padding)
                .replace(/\-/g, "+")
                .replace(/_/g, "/");

            const rawData = window.atob(base64);
            const outputArray = new Uint8Array(rawData.length);

            for (let i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i);
            }
            return outputArray;
        }
    }

    // socketHandler = (socketDataIn) => {
    //     if (this.state.states) {
    //         var newArray = this.state.states.slice();

    //         var found = 0;
    //         for (var s in newArray) {
    //           if (newArray[s].id == socketDataIn.id) {
    //             found = 1;
    //             var mergedEntry = _.merge(newArray[s], socketDataIn);
    //             newArray[s] = mergedEntry;
    //             this.setState({ states: newArray });
    //           }
    //         }

    //         if (found == 0) {
    //           newArray.push(socketDataIn);
    //           this.setState({ states: newArray });
    //         }

    //         ///////////

    //         if (this.state.view) {
    //           var copyView = Object.assign({}, this.state.view); //creating copy of object

    //           var view = _.merge(copyView, socketDataIn);

    //           this.setState({ view });
    //         }

    //         if (this.state.packets) {
    //           var newPackets = this.state.packets.slice().reverse();
    //           var payload = socketDataIn; //{data: socketDataIn.data, timestamp: socketDataIn.timestamp}
    //           newPackets.push(payload);
    //           this.setState({ packets: newPackets.reverse() });
    //         }
    //       }
    // }

    setProps = (a) => {
        test.un = a.un;
        test.acc = a.acc;
        test.dc = a.dc;
        test.ds = a.ds;
    }

    home = ({ match }) => {
        visitingG = false;
        if (this.state.account) {
            if (match.params.username == undefined) {
                match.params.username = this.state.account.username;
            }
            if (this.state.account.level > 0) {
                return (
                    <div>
                        <StatesViewer openModal={this.openModal} mainView={"devices"} sendProps={this.setProps} username={match.params.username} account={this.state.account} public={false} visiting={false} />
                        <Suspense fallback={<div className="spinner"></div>}>
                            <ApiInfo apikey={this.state.account.apikey} />
                            <Stats />
                            <Footer loggedIn={true} />
                        </Suspense>
                    </div>
                )
            } else {
                return (
                    <div>
                        <Account loginPanel={this.state.loginPanel} registrationPanel={this.state.registrationPanel} account={this.state.account} />
                        <Landing />
                        {/* 
                        // Jan 5 2019
                        // ROUAN: Disabled for now until we have more devices shared publicly, or built a proper way to explore devices for non-logged in users.

                        <StatesViewer openModal={this.openModal} mainView={"devices"} sendProps={this.setProps} username={match.params.username} account={this.state.account} public={true} visiting={false} /> 
                        */}
                        <Footer loggedIn={false} />
                    </div>)
            }
        } else {
            return null
        }
    }

    deviceView = ({ match }) => {
        if (this.state.account && this.state.public != undefined) {
            if (this.state.account.username == match.params.username) {
                visitingG = false;
            } else {
                visitingG = true;
            }
            return (
                <div>
                    <DeviceView
                        openModal={this.openModal}
                        mainView={this.state.devicesView}
                        changeMainView={this.changeView}
                        devid={match.params.devid}
                        username={match.params.username}
                        visituser={this.state.visituser}
                        acc={test.acc}
                        deviceCall={test.dc}
                        devices={test.ds}
                        sendProps={this.setProps}
                        account={this.state.account}
                        public={this.state.public}
                        visiting={visitingG}
                    />
                </div>
            )
        } else {
            return null
        }
    }

    passUserInfo = (info) => {
        this.setState({ visituser: info })
    }

    userView = ({ match }) => {
        visitingG = true;
        if (this.state.account) {
            return (
                <div>
                    <UserPage visitu={this.passUserInfo} username={match.params.username} />
                    <StatesViewer openModal={this.openModal} mainView={"devices"} sendProps={this.setProps} username={match.params.username} account={this.state.account} public={false} visiting={true} />
                    <Footer />
                </div>

            )
        } else return <div className="spinner"></div>
    }

    recoverPassword = ({ match }) => {
        return (
            <div>
                <Recovery recoverToken={match.params.recoverToken} />
            </div>
        )
    }

    secure = ({ match }) => {
        return (
            <div>
                <Encrypt />
            </div>
        )
    }

    settings = ({ match }) => {
        if (this.state.account) {
            if (this.state.account.level > 0) {
                return (
                    <Suspense fallback={<div className="spinner"></div>}>
                        <SettingsView />
                    </Suspense>
                )
            } else {
                return (
                    <div>
                        <Account registrationPanel={this.state.registrationPanel} loginPanel={this.state.loginPanel} account={this.state.account} />
                        <Landing />
                        <StatesViewer openModal={this.openModal} mainView={"devices"} sendProps={this.setProps} username={match.params.username} account={this.state.account} public={true} visiting={false} />
                        <Footer loggedIn={false} />
                    </div>
                )
            }
        }
        else {
            return null
        }
    }

    notifications = ({ match }) => {
        return (
            <NotificationsView />
        )
    }

    changeView = (view) => {
        this.setState({ devicesView: view });
    }

    openModal = (origination) => {
        if (origination == "ChangePassword") {
            this.setState({ isOpen2: true });

        } else if (origination == "addDevice") {
            this.setState({ isOpen: true });
        }
    }

    addDevice = () => {
        if (this.state.account) {
            return (
                <AddDevice register={() => { this.setState({ registrationPanel: true }) }} login={() => { this.setState({ loginPanel: true }) }} mainView={this.state.devicesView} account={this.state.account} isOpen={this.state.isOpen} closeModel={() => { this.setState({ isOpen: false }) }} />
            )
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="App">
                <Router>
                    <div>
                        <NavBar openModal={this.openModal} mainView={this.changeView} version={this.state.version} account={this.state.account} />
                        {this.addDevice()}
                        <Route exact path="/" component={this.home} />
                        <Route path="/recover/:recoverToken" component={this.recoverPassword} />
                        <Route exact path="/u/:username" component={this.userView} />
                        <Route exact path="/u/:username/view/:devid" component={this.deviceView} />
                        <Route path="/settings" component={this.settings} />
                        <Route exact path="/accounts/secure" component={this.secure} />
                        <Route path="/notifications" component={this.notifications} account={this.state.account} />
                    </div>
                </Router>
            </div>
        )
    }
}

export default App;
