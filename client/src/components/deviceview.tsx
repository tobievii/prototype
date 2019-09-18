import React from "react";
import { api } from "../api";
import { CorePacket } from "../../../server/shared/interfaces";
import { JSONviewer } from "./jsonviewer";

import { ProtoEditor } from "./editor"
import { Dashboard } from "./dashboard/dashboard"
import { colors } from "../theme";
import { Menu2 } from "./menu_2";

import * as plugins from '../../../plugins/plugins_list_ui'

import { PopupWrap } from "./popups/popup_wrap"
import { clone } from "../utils/lodash_alt";

interface MyProps {
  username?: string;
  id?: string;
  publickey?: string;
  hidecontrols?: boolean;
}

interface MyState {
  pluginPopupsVisibility: any
  [index: string]: any
}

export class DeviceView extends React.Component<MyProps, MyState> {
  state = {
    state: undefined,
    message: undefined,
    showEditor: false,
    showData: false,
    hidecontrols: false,
    pluginPopupsVisibility: undefined
  };

  wrapper;

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {

    if (this.props.hidecontrols) {
      this.state.hidecontrols = this.props.hidecontrols;
    }

    if (this.props.username && this.props.id) {
      this.loadfromusernameid(this.props.username, this.props.id)
    }

    if (this.props.publickey) {
      this.loadfrompublickey(this.props.publickey);
    }

    // plugin popup visibility
    // var pluginPopupsVisibility: any = {}
    // for (var pluginName of Object.keys(plugins).sort()) {
    //   //temparray.push({ text: pluginName, icon: "plug", onClick: () => { } })
    //   pluginPopupsVisibility[pluginName] = false;
    // }

    // this.setState({ pluginPopupsVisibility })

  };

  loadfromusernameid = (username, id) => {
    api.view({ username: this.props.username, id: this.props.id },
      (err, state) => {
        if (err) {
          console.log(err);
          this.setState({ message: err });
        }

        if (state) {
          this.setState({ state });

          api.subscribe({ publickey: state.publickey }, (state) => {
            this.setState({ state })
          });

        }
      }
    );
  }

  loadfrompublickey = (publickey) => {
    if (publickey) {
      api.view({ publickey: publickey }, (err, state) => {
        if (err) { this.setState({ message: err }) }
        if (state) {
          if (state.publickey) this.setState({ state })
        }
      })

      api.subscribe({ publickey: publickey }, (state) => {
        this.setState({ state })
      });
    }
  }

  componentWillUnmount = () => {
    api.removeListener("states", this.stateUpdater);
  };

  stateUpdater = (states: CorePacket[]) => {
    console.log(states);
    // // if this device updated let's update state
    // if (!this.state.state) { return; }
    // if (!this.state.state.key) { return; }

    // for (var s in states) {
    //   if (states[s].key == this.state.state.key) {
    //     if (states[s]["_last_seen"] != this.state.state["_last_seen"]) {
    //       // must be new?
    //       this.setState({ state: states[s] });
    //     }
    //   }
    // }
  };

  pluginsRenderPopupComponents = () => {
    var PopupComponentToDisplay = plugins[this.state.pluginPopupsVisibility]
    return <PopupWrap onClose={() => { this.setState({ pluginPopupsVisibility: undefined }) }}>
      <PopupComponentToDisplay />
    </PopupWrap>
  }


  showPopup = (pluginName) => {
    return (evt) => {
      console.log("show plugin " + pluginName)
      this.setState({ pluginPopupsVisibility: pluginName })
    }
  }

  render() {

    /** build the plugins menuitems list */
    var pluginsMenuItems = []
    for (var pluginName of Object.keys(plugins).sort()) {
      pluginsMenuItems.push({
        text: pluginName, icon: "plug", onClick: this.showPopup(pluginName) // if (this.state.pluginPopupsVisibility) {
        //   console.log(this.state.pluginPopupsVisibility)
        //   var pluginPopupsVisibility = clone(this.state.pluginPopupsVisibility)
        //   // hide all
        //   for (var p of Object.keys(pluginPopupsVisibility)) { pluginPopupsVisibility[p] = false }
        //   // show this one
        //   pluginPopupsVisibility[pluginName] = true;
        //   this.setState({ pluginPopupsVisibility })
        // }


      })
    }


    if (this.state.state == undefined) {
      return <div style={{ padding: 20 }}></div>;
    }

    if (this.state.state) {
      return (
        <div style={{ padding: colors.padding * 2 }}>

          {(!this.state.hidecontrols) &&
            <div>

              <Menu2 menuitems={[
                { responsive: true, icon: "server", text: "Data", onClick: () => { this.setState({ showData: !this.state.showData }); } },
                { responsive: true, icon: "code", text: "Code", onClick: () => { this.setState({ showEditor: !this.state.showEditor }); } },
                { responsive: true, icon: "plug", text: "plugins", onClick: () => { }, menuitems: pluginsMenuItems },
                { responsive: true, link: "/docs/websocket", icon: "share-alt", text: "Sharing", onClick: () => { } },
                { responsive: true, link: "/docs/websocket", icon: "eraser", text: "Clear", onClick: () => { } },
                { responsive: true, link: "/docs/mqtt", icon: "trash", text: "Delete", onClick: () => { } }]}
              />



            </div>}

          {(this.state.pluginPopupsVisibility) && this.pluginsRenderPopupComponents()}

          <div style={{ display: "flex", flexDirection: "row" }}>

            {(this.state.showData) &&
              <div style={{ flex: "0", width: "400px" }}>
                <div style={{ overflowY: "scroll" }}>
                  <JSONviewer object={this.state.state} />
                </div>
              </div>
            }



            <div style={{ flex: "5", paddingTop: colors.padding }}>
              {(this.state.showEditor) && <div><ProtoEditor state={this.state.state} /> </div>}

              <div style={{ paddingTop: colors.padding }}>
                <Dashboard hidecontrols={this.state.hidecontrols} state={this.state.state} />
              </div>
            </div>


            {/* <div style={{ padding: colors.padding }}>
                USERNAME: {this.state.state.username}<br />
                ID: {this.state.state.id}
              </div> */}



          </div>

        </div>
      );
    }
  }
}
