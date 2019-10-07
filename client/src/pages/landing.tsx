import React from "react";
import { Registration } from "../components/registration";
import { colors } from "../theme";

import { Hero } from "./herolanding"

interface MyProps { }

interface MyState {
  //[index: string]: any
}

export class Landing extends React.Component<MyProps, MyState> {
  state = {};

  render() {

    var paragraphstyle = { color: "#777777", fontSize: "16pt" }

    return (
      <div style={{ paddingTop: "0", background: "#232323", height: "100%", zIndex: 1 }}>

        <div>
          <div style={{ background: "#171717", padding: colors.padding * 2, zIndex: 3 }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <Registration />
            </div>
          </div>

          <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
              <div style={{ width: "75%", float: "right", zIndex: 1, right: 0, top: 0 }}>
                <Hero display={true} />
              </div>
              <div style={{ width: "75%", padding: colors.padding * 2, zIndex: 2, position: "absolute", top: 0, left: 0 }}>
                <h1>Internet of things for everyone.</h1>
                <p style={paragraphstyle}>Simple as possible to connect anything.<br />
                  Build custom interfaces easily.
              </p>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: "1200px", margin: "-100px auto", marginBottom: "50px", position: "relative" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <img src="/img/landingPage_devicelist.gif" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ padding: colors.padding * 2, paddingTop: 80 }}>
                  <h1>Devicelist</h1>
                  <p style={paragraphstyle}>Quickly see alarm, warning, share or public status of devices while the map view shows you where you need to focus.</p>
                </div>
              </div>
            </div>
          </div>

        </div>



        <div style={{ background: "#1D1D1D" }}>

          <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: 100, display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 1 }}>
              <h1>Dashboard</h1>
              <p style={paragraphstyle}>Drag and drop new buttons, graphs and gauges. Powerful API to build your own widgets.</p>
            </div>

            <div style={{ flex: 1 }}>
              <img src="/img/landing_dashboard.gif" />
            </div>
          </div>



          <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: 100, paddingBottom: 100, display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 1 }}>
              <h1>Editor</h1>
              <p style={paragraphstyle}>Script the behaviour of your devices directly in the browser. Easily count events, automate actions and gain value from data.</p>
            </div>

            <div style={{ flex: 1 }}>
              <img src="/img/landing_editor.gif" />
            </div>

          </div>

        </div>

        {/* <Cards /> */}
      </div>
    );
  }
}
