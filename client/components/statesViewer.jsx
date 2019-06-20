import React, { Component } from "react";
import './react-confirm-alert/src/react-confirm-alert.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort, faSortNumericDown, faSortAlphaDown, faSortAmountDown } from '@fortawesome/free-solid-svg-icons'
import * as _ from "lodash"
import * as p from "../prototype.ts"
import { StatesViewerMenu } from "./statesViewerMenu.jsx"
import { StatesViewerItem } from "./statesViewerItem.jsx"

import MapDevices from './dashboard/map';
import ChangePassword from '../components/changePassword'
import { confirmAlert } from 'react-confirm-alert';
import { DeviceHistory } from "./dashboard/device_history.jsx"
import Fullscreen from "react-full-screen";

library.add(faSort)
library.add(faSortNumericDown);
library.add(faSortAlphaDown);
library.add(faSortAmountDown);

import socketio from "socket.io-client";
import ModifyDevices from "./modifyDevices";

export class DeviceList extends Component {

  state = {
    activePage: 1,
    alarmStates: []
  }

  // onPageChange = (data) => {
  //   this.setState({ activePage: data.text })
  // }

  handleActionCall = (a) => {
    return (e) => {
      this.props.actionCall({ a, e })
    }
  }

  componentWillMount = () => {
    this.props.alarmStates(this.state.alarmStates);
  }

  handleMapAction = (device) => {
    return (e) => {
      this.props.mapactionCall({ e })
    }
  }

  render() {
    if (this.props.devices == undefined) {
      return (
        <div className="row " style={{ opacity: 0.5 }}>
          <div className="col-12" style={{ padding: "0 5px 0 5px" }}>
            <div className="commanderBgPanel" style={{ margin: 0 }}>
              <center>Loading...</center>
            </div>
          </div>
        </div>
      )
    }

    if (this.props.devices.length == 0) {
      return (
        <div className="row " style={{ opacity: 0.5 }}>
          <div className="col-12" style={{ padding: "0 5px 0 5px" }}>
            <div className="commanderBgPanel" style={{ margin: 0 }}>
              <center>No devices to display.</center>
              {/* <ToastContainer /> */}
            </div>
          </div>
        </div>
      )
    } else {

      var devicelist = _.clone(this.props.devices);

      // if (this.props.max) {
      //   var start = this.props.max * (this.state.activePage - 1)
      //   var end = this.props.max * this.state.activePage
      //   devicelist = devicelist.slice(start, end);
      // }

      if (devicelist.length == 0) {
        if (this.state.activePage != 1) {
          this.setState({ activePage: 1 })
        }
      }

      return (
        <div>
          {devicelist.map(device => <StatesViewerItem alarmStates={this.state.alarmStates} mainView={this.props.mainView} public={this.props.public} username={this.props.username} view={this.props.view} mapActionCall={this.handleMapAction(device)} actionCall={this.handleActionCall(device.key)} key={device.key} device={device} devID={device.devid} public={this.props.public} account={this.props.account} visiting={this.props.visiting} />)}
          {/* <div style={{ marginLeft: -9 }}> <Pagination pages={pages} className="row" onPageChange={this.onPageChange} /> </div> */}
        </div>
      )
    }
  }
}

export class StatesViewer extends Component {
  state = {
    search: "",
    sort: "",
    devicesServer: [],
    devicesView: undefined,
    checkboxstate: "Select All",
    boxtick: "far fa-check-square",
    publicButton: "",
    deleteButton: "",
    shareButton: "",
    selectedDevices: [],
    selectAllState: null,
    view: "map",
    devicePressed: undefined,
    boundary: undefined,
    showB: false,
    buttonColour: " ",
    tempdev: [],
    selectedModification: "",
    modificationinfo: "",
    sortvalues: {
      timedesc: "asc",
      namedesc: "asc",
      selected: "asc",
      alarm: "asc",
      warning: "asc",
      shared: "asc",
      public: "asc"
    },
    isOpen: false,
    Modifychoice: "",
    isOpenModify: false,
    tempdev: [],
    toggleOn: false,
    toggleOff: true,
    isFull: false,
    screensize: "fas fa-expand"
  };

  socket = undefined;
  busyGettingNewDevice = false;

  constructor(props) {
    super(props)
    this.socket = socketio({ transports: ['websocket', 'polling'] });
    fetch("/api/v3/getsort", {
      method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" },
    }).then(response => response.json()).then(serverresponse => {
      if (serverresponse.sort == null || serverresponse.sort == undefined) {
        serverresponse.sort = "";
      } else if (serverresponse.sortvalues == null || serverresponse.sortvalues == undefined) {
        serverresponse.sortvalues = {
          timedesc: "asc",
          namedesc: "asc",
          selected: "asc",
          alarm: "asc",
          warning: "asc",
          shared: "asc",
          public: "asc"
        };
      }

      this.setState({ sort: serverresponse.sort })
      this.setState({ sortvalues: serverresponse.sortvalues })
    }).catch(err => console.error(err.toString()));

    this.socket.on("connect", a => {
      this.socket.emit("join", this.props.username)
      this.socket.on("info", (info) => {
        if (info.newdevice) {
          p.statesByUsername(this.props.username, (states) => {
            for (var s in states) {
              states[s].selected = false
            }
            var packet1 = {
              id: info.newdevice.id,
              data: info.newdevice.payload.data,
              timestamp: info.newdevice.payload.timestamp
            }


            if (this.state.logData != undefined) {
              if (this.state.logData[0].timestamp <= packet1.timestamp) {
                var newd = _.clone(this.state.logData)
                var n = [];
                n.push(packet1);
                for (var count in newd) {
                  n.push(newd[count]);
                }
                this.setState({ logdataNew: n })
                this.setState({ logData: n })
              }
            }


            // if (this.props.account.level >= 100) {
            //   fetch("/api/v3/states/usernameToDevice", {
            //     method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
            //   }).then(response => response.json()).then(serverresponse => {
            //     for (var s in serverresponse) {
            //       serverresponse[s].selected = false
            //     }
            //     this.setState({ devicesServer: serverresponse }, () => {
            //       for (var device in this.state.devicesServer) {
            //         this.socket.emit("join", this.state.devicesServer[device].key);
            //       }

            //       this.setState({ devicesView: serverresponse }, () => {
            //         //this.socketConnectDevices();
            //         this.sort();
            //       })
            //     })
            //   }).catch(err => console.error(err.toString()));
            // }
            //else if (this.props.account.level < 100) {
            this.setState({ devicesServer: states }, () => {

              for (var device in this.state.devicesServer) {
                this.socket.emit("join", this.state.devicesServer[device].key);
              }
              this.setState({ devicesView: states }, () => {
                this.sort(this.state.sort);
              })
            })
            //}
          })
        }
      })

      this.socket.on("post", (packet) => {
        this.handleDevicePacket(packet)
        if (this.state.logData != undefined) {
          if (this.state.logData[0].timestamp <= packet.timestamp) {
            var newd = _.clone(this.state.logData)
            var n = [];
            n.push(packet);
            for (var count in newd) {
              n.push(newd[count]);
            }
            this.setState({ logdataNew: n })
            this.setState({ logData: n })
          }
        }
      })


      this.socket.on("notificationState", a => {
        this.getDevices("notification");
      })

      this.socket.on('boundary', (packet) => {
        this.handleDevicePacket(packet)
      })
    });
  }

  getDevices = (functionCall) => {

    if ((this.props.visiting == true || this.props.visiting == undefined) && this.props.account.level > 0) {
      fetch('/api/v3/user/' + this.props.username, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      }).then(response => response.json()).then((user) => {
        p.statesByUsername(this.props.username, (states) => {
          for (var s in states) {
            states[s].selected = false
            // if (states[s].meta.user.email !== user.email) {
            //   states.splice(s)
            // }
          }

          this.setState({ devicesServer: states }, () => {
            for (var device in this.state.devicesServer) {
              this.socket.emit("join", this.state.devicesServer[device].key);
            }
            this.setState({ devicesView: states }, () => {
              if (functionCall == "initial load") {
                this.sort(this.state.sort);
              }
            })
          })
        })
      }).catch(err => console.error(err.toString()))
    }

    if (this.props.public == true || this.props.account.level == 0) {
      p.publicStates((states) => {
        for (var s in states) {
          states[s].selected = false
        }

        fetch("/api/v3/states/usernameToDevice", {
          method: "GET", headers: { "Accept": "application/json", "Content-Type": "application/json" }
        }).then(response => response.json()).then(serverresponse => {
          for (var s in serverresponse) {
            serverresponse[s].selected = false
          }
          this.setState({ devicesServer: serverresponse }, () => {
            for (var device in this.state.devicesServer) {
              this.socket.emit("join", this.state.devicesServer[device].key);
            }

            this.setState({ devicesView: serverresponse }, () => {
              if (functionCall == "initial load") {
                this.sort(this.state.sort);
              }
            })
          })
        }).catch(err => console.error(err.toString()));
      })
    }
    else if (this.props.account.level > 0 && this.props.visiting == false) {
      p.statesByUsername(this.props.username, (states) => {
        for (var s in states) {
          states[s].selected = false
        }

        this.setState({ devicesServer: states }, () => {
          for (var device in this.state.devicesServer) {
            this.socket.emit("join", this.state.devicesServer[device].key);
          }
          this.setState({ devicesView: states }, () => {
            if (functionCall == "initial load") {
              this.sort(this.state.sort);
            }
          })
        })

        if (states.length == 0 && this.props.visiting == false) {
          var url = window.location.origin + "/api/v3/data/post";
          setTimeout(() => {
            fetch(url, {
              method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({
                "id": "Dummy_Device",
                "data": {
                  "temperature": 24.54,
                  "doorOpen": false,
                  "gps": {
                    "lat": 25.123,
                    "lon": 28.125
                  }
                }
              })
            }).then(response => response.json()).then(resp => {
            }).catch(err => console.error(err.toString()));
          }, 10000)
        }
      })
    }
  }

  componentWillMount = () => {
    setTimeout(() => {
      this.getDevices("initial load");
    }, 50);
  }
  componentDidMount = () => {
    this.changePassword()
  }
  openModal = (origination) => {
    this.setState({ isOpen: true });
  }

  changePassword = () => {
    try {
      if (this.props.account.email == "admin@localhost.com" && this.props.account.passChange == false) {
        window.alert("We've noticed that you haven't changed your default password. Please change it to continue")
        this.openModal();
      }
    } catch (e) {
      if (e instanceof TypeError) {
        return
      } else {
        printError(e, false);
      }
    }
  }

  componentWillUnmount = () => {
    fetch("/api/v3/sort", {
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ sort: this.state.sort, sortvalues: this.state.sortvalues })
    }).then(response => response.json()).then(serverresponse => {
    }).catch(err => console.error(err.toString()));
    this.socket.disconnect();
  }

  componentDidUpdate = () => {
    var un = this.props.username;
    var acc = this.props.account;
    var dc = this.state.devicePressed;
    var ds = this.state.devicesServer;
    this.props.sendProps({ un, acc, dc, ds })
    var data = Buffer.from(JSON.stringify({ wifi: { ssid: "devprotowifi", pass: "devprotowifi" } }))
  }

  handleDevicePacket = (packet) => {
    var devices = _.clone(this.state.devicesServer)
    var found = 0;
    for (var dev in devices) {
      if (devices[dev].devid == packet.id) {
        found = 1;
        devices[dev]["_last_seen"] = packet.timestamp;
        devices[dev].payload = _.merge(devices[dev].payload, packet)
      } else if (devices[dev].devid == packet.devid) {
        if (packet.boundaryLayer != undefined) {
          found = 1;
          devices[dev]["_last_seen"] = packet._last_seen;
          devices[dev].payload.timestamp = packet._last_seen;
          devices[dev].boundaryLayer = packet.boundaryLayer;
        } else {
          found = 1;
          devices[dev]["_last_seen"] = packet._last_seen;
          devices[dev].payload.timestamp = packet._last_seen;
          packet.selectedIcon = true;
          devices[dev] = _.merge(devices[dev].boundaryLayer, packet);
        }
      }
    }

    if (found == 0) {
      // console.log("recieved data for device not on our list yet.")
    } else {
      // update
      if (this.state.search.length > 0) {
        this.setState({ devicesServer: devices })
      } else {
        this.setState({ devicesServer: devices })
        // this.setState({ devicesView: devices }, () => {
        // })
        this.sort(this.state.sort, "devicePost");
      }
    }
  }

  // updateDeviceList = () => {
  //   var loadList = _.clone(this.state.devicesView);

  //   this.setState({ devicesServer: loadList })
  //   this.setState({ devicesView: loadList }, () => {
  //     this.sort()
  //   })    

  // }

  search = evt => {
    this.setState({ search: evt.target.value.toString() }, () => {
      var newDeviceList = []
      for (var device of this.state.devicesServer) {
        if (this.state.search.length > 0) {
          if (device.meta.user != null || device.meta.user != undefined) {
            if (device.devid.toString().toLowerCase().includes(this.state.search.toLowerCase()) || device.meta.user.email.toString().toLowerCase().includes(this.state.search.toLowerCase())) {
              newDeviceList.push(device)
            }
          }
          else {
            if (device.devid.toString().toLowerCase().includes(this.state.search.toLowerCase())) {
              newDeviceList.push(device)
            }
          }
        }
        else {
          newDeviceList.push(device)
        }
      }
      //end filter
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)
    })
  }

  sort = (sorttype, call) => {
    var sv = _.clone(this.state.sortvalues)
    var value = sorttype;

    var newDeviceList = _.clone(this.state.devicesView)

    if (call == "post" && call != undefined) {
      if (value == "namedesc" && this.state.sortvalues.namedesc == "asc") {
        newDeviceList.sort((a, b) => {
          if (a.devid >= b.devid) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.namedesc = "des"
        }
      } else if (value == "namedesc" && this.state.sortvalues.namedesc == "des") {
        newDeviceList.sort((a, b) => {
          if (a.devid >= b.devid) {
            return 1
          } else { return -1 }
        })

        if (call != "devicePost" && call != undefined) {
          sv.namedesc = "asc"
        }
      }

      if (value == "timedesc" && this.state.sortvalues.timedesc == "asc") {
        newDeviceList.sort((a, b) => {
          if (new Date(a["_last_seen"]) < new Date(b["_last_seen"])) {
            return 1
          } else {
            return -1
          }
        }).reverse();
        sv.timedesc = "asc"
        if (call != "devicePost" && call != undefined) {
          sv.timedesc = "des"
        }
      } else if (value == "timedesc" && this.state.sortvalues.timedesc == "des") {
        newDeviceList.sort((a, b) => {
          if (new Date(a["_last_seen"]) > new Date(b["_last_seen"])) {
            return 1
          } else {
            return -1
          }
        }).reverse();
        sv.timedesc = "des"
        if (call != "devicePost" && call != undefined) {
          sv.timedesc = "asc"
        }
      }

      if (value == "selected" && this.state.sortvalues.selected == "asc") {
        newDeviceList.sort((a, b) => {
          if (a.selected == true && b.selected == false) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.selected = "des"
        }
      } else if (value == "selected" && this.state.sortvalues.selected == "des") {
        newDeviceList.sort((a, b) => {
          if (a.selected == false && b.selected == true) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.selected = "asc"
        }
      }

      if (value == "alarm") {
        var alarmstates = _.clone(this.state.alarmStates);
        for (var device in newDeviceList) {
          for (var c in alarmstates) {
            if (alarmstates[c].key == newDeviceList[device].key) {
              newDeviceList[device]["alarm"] = true;
            }
          }
        }
        if (this.state.sortvalues.alarm == "asc") {
          newDeviceList.sort((a, b) => {
            if (a.alarm == true && b.alarm == undefined) {
              return 1
            } else { return -1 }
          }).reverse();

          if (call == "post" && call != undefined) {
            sv.alarm = "des"
          }

        } else if (this.state.sortvalues.alarm == "des") {
          newDeviceList.sort((a, b) => {
            if (a.alarm == undefined && b.alarm == true) {
              return 1
            } else { return -1 }
          }).reverse();

          if (call == "post" && call != undefined) {
            sv.alarm = "asc"
          }
        }
      }

      if (value == "warning" && this.state.sortvalues.warning == "asc") {
        var notifications = this.props.account.notifications;
        for (var device in newDeviceList) {
          for (var s in notifications) {
            if ((notifications[s].type == "CONNECTION DOWN 24HR WARNING" || notifications[s].type == "WARNING") && newDeviceList[device].devid == notifications[s].device && notifications[s].seen == false) {
              newDeviceList[device]['warning'] = true
            }
          }
        }
        newDeviceList.sort((a, b) => {
          if ((a.notification24 == true || a.warning == true) && (b.notification24 == undefined || b.warning == undefined)) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.warning = "des"
        }
      } else if (value == "warning" && this.state.sortvalues.warning == "des") {
        newDeviceList.sort((a, b) => {
          if ((a.notification24 == undefined || a.warning == undefined) && (b.notification24 == true || b.warning == true)) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.warning = "asc"
        }
      }

      if (value == "shared" && this.state.sortvalues.shared == "asc") {
        newDeviceList.sort((a, b) => {
          if (a.access != undefined && a.access.length > 0 && (b.access == undefined || b.access.length == 0)) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.shared = "des"
        }
      } else if (value == "shared" && this.state.sortvalues.shared == "des") {
        newDeviceList.sort((a, b) => {
          if (b.access != undefined && b.access.length > 0 && (a.access == undefined || a.access.length == 0)) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.shared = "asc"
        }
      }

      if (value == "public" && this.state.sortvalues.public == "asc") {
        newDeviceList.sort((a, b) => {
          if (a.public == true && b.public == undefined) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.public = "des"
        }
      } else if (value == "public" && this.state.sortvalues.public == "des") {
        newDeviceList.sort((a, b) => {
          if (b.public == true && a.public == undefined) {
            return 1
          } else { return -1 }
        }).reverse();

        if (call != "devicePost" && call != undefined) {
          sv.public = "asc"
        }
      }
      this.setState({ sort: sorttype },
        this.setState({ sortvalues: sv }))
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate);
    }
  }

  selectCountUpdate = () => {
    var selectCount = 0;
    for (var dev in this.state.devicesView) {
      if (this.state.devicesView[dev].selected) {
        selectCount++;
      }
    }

    if (selectCount > 0) {
      this.setState({ buttonColour: "colorRed" })
    } else {
      this.setState({ buttonColour: " " })
    }

    this.setState({ selectCount: selectCount })
  }

  selectAll = (value) => {
    var newDeviceList = _.clone(this.state.devicesView)

    if (value == true) {
      for (var dev in newDeviceList) {
        newDeviceList[dev].selected = true;
        this.state.selectedDevices.push(newDeviceList[dev].devid);
      }
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)
      this.setState({ selectAllState: true });
    } else if (value == false) {
      for (var dev in newDeviceList) {
        newDeviceList[dev].selected = false;
        this.state.selectedDevices.pop(newDeviceList[dev].devid);
      }
      this.setState({ devicesView: newDeviceList }, this.selectCountUpdate)
      this.setState({ selectAllState: false });
    }
  }

  handleActionCall = (clickdata) => {
    var newDeviceList = _.clone(this.state.devicesView)

    for (var dev in newDeviceList) {
      if (newDeviceList[dev].key == clickdata.a) {
        if (clickdata.e == "deselect") {
          if (this.state.selectAllState === true) {
            this.setState({ selectAllState: false });
          }
          newDeviceList[dev].selected = false;
        }
        if (clickdata.e == "select") {
          newDeviceList[dev].selected = true;
        }
      }
    }
    this.setState({ devicesView: newDeviceList }, this.selectCountUpdate);
  }

  deviceClicked = (device, action) => {
    var newDeviceList = _.clone(this.state.devicesView)

    this.showBoundaryPath(false);

    if (this.props.mainView == "dashboardDevices" && device.e.call == "device") {
      this.props.deviceClicked(device.device);
    } else if (device.e.call == "map") {

      for (var devices in newDeviceList) {
        if (newDeviceList[devices].selectedIcon == true) {
          newDeviceList[devices].selectedIcon = false;
        }
      }

      for (var dev in newDeviceList) {
        if (newDeviceList[dev].key == device.e.device.key) {
          if (!device.e.action) {
            newDeviceList[dev].selectedIcon = false;
          } else if (device.e.action && newDeviceList[dev].boundaryLayer == undefined) {
            newDeviceList[dev].selectedIcon = true;
          } else if (device.e.action && newDeviceList[dev].boundaryLayer != undefined) {
            newDeviceList[dev].selectedIcon = true;
          }
        }
      }
      this.setState({ devicesView: newDeviceList });
      this.setState({ boundary: device.e.action });
    }
    this.setState({ devicePressed: device.e.device });
  }

  deleteSelectedDevices = () => {
    var devicesToDelete = this.state.devicesServer.filter((device) => { return device.selected == true; })

    for (var dev in devicesToDelete) {
      if (devicesToDelete[dev].selected === true) {
        fetch("/api/v3/state/delete", {
          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ id: devicesToDelete[dev].devid, key: devicesToDelete[dev].key })
        }).then(response => response.json()).then(serverresponse => {
        }).catch(err => console.error(err.toString()));
      }
    }
    // -------------------------------
    var devicesServerTemp = this.state.devicesServer.filter((device) => { return device.selected == false; })
    var devicesViewTemp = this.state.devicesView.filter((device) => { return device.selected == false; })
    this.setState({ devicesView: devicesViewTemp, devicesServer: devicesServerTemp }, this.selectCountUpdate)
  }

  changeView = (action) => {
    this.setState({ view: action })
  }

  showBoundaryPath = (action) => {
    this.setState({ showB: action })
  }

  updateAlarmStates = (states) => {
    this.setState({ alarmStates: states })
  }

  returnDeviceList = () => {
    var size = 242;

    if (this.props.visiting == true) {
      size = 220;
    } else if (this.props.account.level < 1) {
      size = 223
    } else if (this.props.account.level > 0 && this.props.visiting == undefined) {
      size = 217
    }

    return (
      <div style={{ overflowY: "auto", height: (window.innerHeight * 0.9) - size + "px" }}>
        <div style={{ overflowY: "auto", padding: "2px 0px" }} >
          <DeviceList alarmStates={this.updateAlarmStates} mainView={this.props.mainView} username={this.props.username} devices={this.state.devicesView} view={this.state.view} mapactionCall={this.deviceClicked} actionCall={this.handleActionCall} public={this.props.public} account={this.props.account} visiting={this.props.visiting} />
        </div>
      </div>
    )
  }

  clickDeleteConfirmation = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='protoPopup' align="center">
            <h1>Are you sure?</h1>
            <p>Deleting a device is irreversible</p>
            <div >
              <button className="smallButton" style={{ margin: "5px", backgroundColor: "red", opacity: "0.7" }} onClick={onClose}>No, leave it!</button>

              <button className="smallButton" style={{ margin: "5px", backgroundColor: "green", opacity: "0.6" }} onClick={() => {
                //this.handleClickDelete()
                this.deleteSelectedDevices();
                onClose()
              }}>Yes, delete it!</button>
            </div>
          </div>
        )
      }
    })
  };

  displayMap = () => {
    if (this.props.mainView == "devices") {
      return (this.state.toggleOff ?
        <div className="mapContainer" style={{ height: (window.innerHeight * 0.9) - 98 + "px" }}>
          <MapDevices public={this.props.public} widget={false} showBoundary={this.state.showB} username={this.props.username} acc={this.props.account} deviceCall={this.state.devicePressed} devices={this.state.devicesServer} PopUpLink={true} visiting={this.props.visiting} />
        </div>
        : null
      )
    }
  }

  setlogData = (data) => {
    this.setState({ logData: data })
  }

  screen = () => {
    if (this.state.isFull == false) {
      this.setState({ screensize: "fas fa-compress" })
      this.setState({ isFull: !this.state.isFull });
    } else {
      this.setState({ screensize: "fas fa-expand" })
      this.setState({ isFull: !this.state.isFull });
    }
  }

  showFullScreenButton = () => {
    const style = {
      margin: 0,
      top: 'auto',
      right: 15,
      bottom: 80,
      left: 'auto',
      position: 'absolute',
      zindex: 1000
    };
    return (
      <button style={style} className={this.state.screensize} onClick={this.screen} />
    )
  }

  displayLog = () => {
    if (this.props.mainView == "devices") {
      return (this.state.toggleOn ?
        <Fullscreen
          enabled={this.state.isFull}
          onChange={isFull => this.setState({ isFull })}
        >
          <div style={{ marginRight: "5%" }}>{this.showFullScreenButton()}</div>
          <div className="mapContainer" style={{ height: (window.innerHeight * 0.9) - 98 + "px" }}>
            <DeviceHistory public={this.props.public} username={this.props.username} devices={this.state.devicesServer} visiting={this.props.visiting} logdata={this.setlogData} logdatanew={this.state.logData} />
          </div>
        </Fullscreen>

        : null
      )
    }
  }

  handleInputFocus = () => {
    this.setState({ toggleOn: !this.state.toggleOn });
    this.setState({ toggleOff: !this.state.toggleOff });
  };

  buttonOne = () => {
    if (this.props.mainView == "devices") {
      return (this.state.toggleOn ? <button onClick={() => { this.handleInputFocus(); }} title="Show map" className="fas fa-toggle-on" /> : null)
    } else return null
  }

  buttonTwo = () => {
    if (this.props.mainView == "devices") {
      return (this.state.toggleOff ? <button onClick={() => { this.handleInputFocus(); }} title="Show device logs" className="fas fa-toggle-off" /> : null)
    } else return null
  }


  deviceButtons = () => {
    return (
      <div className="container-fluid" style={{ marginRight: "auto", marginLeft: "auto" }}>
        <div className="row" style={{}} >
          <span className="col commanderBgPanel commanderBgPanelClickable sucess" style={{ flex: "0 0 130px", padding: "4px 10px" }} onClick={() => { this.props.openModal("addDevice") }}>
            <i className="fas fa-plus"></i>  ADD DEVICE
          </span>
          <div className="col" align="center" style={{ background: "#131e27", paddingTop: "3px", paddingLeft: "0px" }} >DEVICE LIST</div>
          {this.buttonOne()}
          {this.buttonTwo()}
        </div>
      </div>
    )
  }
  openModifyModal = (choice) => {
    switch (choice) {
      case "SET IOTNXT GATEWAY":
        this.setState({ modificationinfo: "A easier way to assign a gateway to multipe devices" })
        break;
      case "SCRIPT PRESET":
        this.setState({ modificationinfo: "You can now assign the same workflow code to multiple devices" })
        break;
      case "DASHBOARD PRESET":
        this.setState({ modificationinfo: "You can now assign the same dashboard to multiple devices" })
        break;
      default:
        this.setState({ modificationinfo: "" });
    }
    this.setState({ selectedModification: choice })
    this.setState({ isOpenModify: true })
  }

  render() {
    if (this.state.deleted == true) {
      return (<div style={{ display: "none" }}></div>);
    } else {
      var count = 0;
      var selected = 0;
      return (
        <div style={{ paddingTop: 25, margin: "30px 12px" }} >
          <div className={"rowList " + this.props.mainView} style={{ background: "#16202C" }}>
            <div>
              <div>
                {this.deviceButtons()}
                < StatesViewerMenu
                  openModifyModal={this.openModifyModal}
                  sortvalues={this.state.sortvalues}
                  mainView={this.props.mainView}
                  deviceCall={this.state.devicePressed}
                  boundary={this.state.boundary}
                  public={this.props.public}
                  acc={this.props.account}
                  search={this.search}
                  selectAll={this.selectAll}
                  devices={this.state.devicesView}
                  sort={this.sort}
                  view={this.changeView}
                  selectCount={this.state.selectCount}
                  deleteSelected={this.deleteSelectedDevices}
                  visiting={this.props.visiting}
                  public={this.props.public} />
                {this.returnDeviceList()}
              </div>
              <div className="container-fluid" style={{ padding: 0 }} >
                {
                  this.state.devicesServer.map((device, i) => {
                    count++;
                    if (device.selected == true) {
                      selected++;
                    }
                    if (count == this.state.devicesServer.length) {
                      return (
                        <div key={i} className="row" style={{ background: "#0E1925", margin: "0px" }}>
                          <div style={{ padding: 5, flex: "0 50%", paddingLeft: 10, opacity: 0.7 }} >{selected} SELECTED</div>
                          <div style={{ padding: 5, flex: "0 50%", textAlign: "right", paddingRight: 11, opacity: 0.7 }} >{count} TOTAL</div>
                        </div>
                      )
                    } else {
                      return null
                    }
                  })
                }
              </div>
            </div>
            {this.displayLog()}
            {this.displayMap()}
            <ModifyDevices account={this.props.account}
              isOpen={this.state.isOpenModify}
              modification={this.state.selectedModification}
              modificationinfo={this.state.modificationinfo}
              closeModel={() => { this.setState({ isOpenModify: false }) }}
              mainView={this.props.mainView}
              devices={this.state.devicesServer} />
            <ChangePassword
              account={this.props.account}
              isOpen={this.state.isOpen}
              closeModel={() => { this.setState({ isOpen: false }) }}
            />
          </div>
        </div >
      )
    }
  }
}
