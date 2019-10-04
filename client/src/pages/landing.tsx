import React from "react";
import { Registration } from "../components/registration";
import { colors, theme } from "../theme";

import { Cards } from "./cards";

interface MyProps {}

interface MyState {
  //[index: string]: any
}

export class Landing extends React.Component<MyProps, MyState> {
  state = {};

  render() {
    return (
      <div style={{ paddingTop: "2em", textAlign: "center" }}>
        <div style={{ margin: "0 auto" }}>
          <div style={{ background: "#1D1D1D", padding: colors.padding * 2 }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <Registration />
            </div>
          </div>
          <img src="/img/landingpage_mockup.jpg" style={{ width: "100%" }} />
        </div>

        {/* <Cards /> */}
      </div>
    );
  }
}
