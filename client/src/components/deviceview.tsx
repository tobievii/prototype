import React from "react";
import { api } from "../api";
import { CorePacket } from "../../../server/shared/interfaces";
import { JSONviewer } from "./jsonviewer";
import { logger } from "../../../server/shared/log";

import { ProtoEditor } from "./editor"

interface MyProps {
  username: string;
  id: string;
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
      logger.log({
        message: "loading deviceview",
        data: this.props,
        level: "verbose"
      });

      api.subscribe({ username: this.props.username });

      api.state(
        { username: this.props.username, id: this.props.id },
        (err, state) => {
          if (err) {
            this.setState({ message: err });
          }

          if (state) {
            this.setState({ state });
          }
        }
      );
    }

    api.on("states", this.stateUpdater);
  };

  componentWillUnmount = () => {
    api.removeListener("states", this.stateUpdater);
  };

  stateUpdater = (states: CorePacket[]) => {
    console.log("--- stateUpdated!")
    console.log(states);

    // if this device updated let's update state
    if (!this.state.state) { return; }
    if (!this.state.state.key) { return; }

    for (var s in states) {
      if (states[s].key == this.state.state.key) {
        if (states[s]["_last_seen"] != this.state.state["_last_seen"]) {
          // must be new?
          this.setState({ state: states[s] });
        }
      }
    }

  };

  render() {
    if (this.state.state == undefined) {
      return <div>...</div>;
    }

    if (this.state.state) {
      return (
        <div
          style={{
            boxSizing: "border-box",
            margin: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden"
          }}
        >
          <div>
            {this.props.id}

            <ProtoEditor state={this.state.state} />
            <JSONviewer object={this.state.state} />
          </div>
        </div>
      );
    }
  }
}
