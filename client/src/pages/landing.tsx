import React from "react";
import { Registration } from "../components/registration";
import { colors, theme } from "../theme";

import { Cards } from "./cards";
import { Hero } from "./herolanding"
interface MyProps { }

interface MyState {
  //[index: string]: any
}

export class Landing extends React.Component<MyProps, MyState> {
  state = {};

  render() {
    return (
      <div style={{ paddingTop: "2em", background: "#232323", height: "100%", zIndex: 1 }}>
        <div style={{ margin: "0 auto" }}>

          <div style={{ background: "#1D1D1D", padding: colors.padding * 2, zIndex: 3 }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <Registration />
            </div>
          </div>

          <div style={{ width: "100%" }}>
            <div style={{ width: "75%", float: "right", zIndex: 1 }}>
              <Hero display={true} />
            </div>

            <div style={{ padding: colors.padding * 2, zIndex: 2 }}>
              <h1>Internet of things for everyone.</h1>
              <p style={{ color: "#666666", fontSize: "24pt" }}>Simple as possible to connect anything.<br />
                Build custom interfaces easily.
              </p>
            </div>



          </div>

        </div>

        {/* <Cards /> */}
      </div>
    );
  }
}
