import React from "react";
import { api } from "../api";
import { CorePacket } from "../../../server/shared/interfaces";
import { JSONviewer } from "./jsonviewer";
import { logger } from "../../../server/shared/log";

import { ProtoEditor } from "./editor"
import { Dashboard } from "./dashboard/dashboard"

interface MyProps {
  username?: string;
  id?: string;
  publickey?: string;
}

interface MyState {
  [index: string]: any;
}

export class DeviceView extends React.Component<MyProps, MyState> {
  state = {
    state: undefined,
    message: undefined
  };

  wrapper;

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    if (this.props.username && this.props.id) {
      this.loadfromusernameid(this.props.username, this.props.id)
    }

    if (this.props.publickey) {
      this.loadfrompublickey(this.props.publickey);
    }
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

  render() {
    if (this.state.state == undefined) {
      return <div style={{ padding: 20 }}></div>;
    }

    if (this.state.state) {
      return (
        <div style={{ margin: 0, width: "100%", height: "100%", overflow: "hidden" }}>



          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: 300 }}>
              <div style={{ padding: 20 }}>
                USERNAME: {this.state.state.username}<br />
                ID: {this.state.state.id}
              </div>
              <div style={{ height: 500, overflowY: "scroll" }}>
                <JSONviewer object={this.state.state} />
              </div>

            </div>

            {/* <div style={{ width: 300 }}>
              <ProtoEditor state={this.state.state} />
            </div> */}

            <div style={{ width: "100%" }}>
              <Dashboard state={this.state.state} />
            </div>

          </div>
        </div>
      );
    }
  }
}
