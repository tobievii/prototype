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

    const cardstyles: any = { width: 250, background: "rgba(255, 255, 255, 0.95)", margin: 10, position: "relative", padding: "120px 5px 40px 5px" }
    const buttonstyles: any = { width: "100%", bottom: -3, left: 0, position: "absolute", borderBottom: "2px solid #333" }
    const cardtextstyle: any = { fontSize: "0.75em", lineHeight: "1.65em" }

    /** provides the responsive styles for the landing hero segment */
    var landingheroSegmentStyle: any = (window.innerWidth > 800)
      ? {
        wrapper: {
          width: "100%", overflow: "hidden",
        },
        subwrap: { maxWidth: "1400px", margin: "0 auto", position: "relative" },
        svgblock: { width: "75%", float: "right", zIndex: 1, right: 0, top: 0 },
        textblock: { width: "75%", padding: colors.padding * 2, zIndex: 2, position: "absolute", top: 0, left: 0 }
      }
      : {
        wrapper: { width: "100%", overflow: "hidden" },
        subwrap: { width: "100%" },
        svgblock: { width: "100%" },
        textblock: { width: "100%", padding: colors.padding * 2, zIndex: 2 }
      }

    /** provides the responsive styles for the devicelist segment */
    var devicelistSegmentWrapperStyle: any = (window.innerWidth > 800)
      ? {
        maxWidth: "1400px",
        margin: "-100px auto",
        marginBottom: "50px",
        position: "relative"
      } : {
        maxWidth: "100%"
      }

    var devicelistSegmentWrapperSubStyle: any = (window.innerWidth > 800)
      ? { display: "flex", flexDirection: "row" }
      : { display: "flex", flexDirection: "column" }

    /** provides the responsive styles for the dashboard/editor segments. */
    var landingSegmentWrapperStyle: any = (window.innerWidth > 800) ? {
      maxWidth: "1400px",
      margin: "0 auto",
      paddingTop: 100,
      display: "flex",
      flexDirection: "row"
    }
      : {
        width: "100%",
        paddingTop: 100,
        display: "flex",
        flexDirection: "column-reverse"
      }

    return (
      <div style={{ paddingTop: "0", background: "#232323", height: "100%", zIndex: 1 }}>

        <div>
          <div style={{ background: "#171717", padding: colors.padding * 2, zIndex: 3 }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <Registration />
            </div>
          </div>

          <div className="landingBannerBg" style={landingheroSegmentStyle.wrapper}>

            <div style={landingheroSegmentStyle.subwrap}>

              <div style={landingheroSegmentStyle.svgblock}>
                <Hero />
              </div>

              <div style={landingheroSegmentStyle.textblock}>
                <h1>Internet of things for everyone.</h1>
                <p style={paragraphstyle}>Simple as possible to connect anything.<br />
                  Build custom interfaces easily.
              </p>
              </div>

            </div>
          </div>

          <div style={devicelistSegmentWrapperStyle}>
            <div style={devicelistSegmentWrapperSubStyle}>
              <div style={{ flex: 1 }}>
                <img style={{ width: "100%" }} src="/img/landingPage_devicelist.gif" />
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
          <div style={landingSegmentWrapperStyle}>
            <div style={{ flex: 1, padding: colors.padding }}>
              <h1>Dashboard</h1>
              <p style={paragraphstyle}>Drag and drop new buttons, graphs and gauges. Powerful API to build your own widgets.</p>
            </div>

            <div style={{ flex: 1 }}>
              <img style={{ width: "100%" }} src="/img/landing_dashboard.gif" />
            </div>
          </div>



          <div style={landingSegmentWrapperStyle}>
            <div style={{ flex: 1, padding: colors.padding }}>
              <h1>Editor</h1>
              <p style={paragraphstyle}>Script the behaviour of your devices directly in the browser. Easily count events, automate actions and gain value from data.</p>
            </div>

            <div style={{ flex: 1 }}>
              <img style={{ width: "100%" }} src="/img/landing_editor.gif" />
            </div>

          </div>

        </div>

        <section style={{ paddingTop: 50 }}>
          <div style={{ color: colors.spotB, maxWidth: 1000, display: "flex", margin: "0 auto" }}>

            <div className="cards" style={cardstyles}>

              <h2>Startup</h2>
              <p style={cardtextstyle}>Link up to 5 devices with Dashboard and automation workflows.</p>
              <button style={buttonstyles}>FREE</button>
            </div>

            <div className="cards" style={cardstyles}>

              <h2>Pro</h2>
              <p style={cardtextstyle}>Unlimited device count. <br />Shared cluster with metered usage.</p>
              <button style={buttonstyles}>Starting at $2.50/mo</button>
            </div>

            <div className="cards" style={cardstyles}>

              <h2>Business</h2>
              <p style={cardtextstyle}>Unlimited device count. <br />Dedicated cloud instance. <br />Isolated hosting.</p>
              <button style={buttonstyles}>Starting at $50/mo</button>
            </div>

            <div className="cards" style={cardstyles}>

              <h2>Enterprise</h2>
              <p style={cardtextstyle}>Custom development.<br />Dedicated baremetal servers.<br />24/7 support</p>
              <button style={buttonstyles}>Contact us</button>
            </div>

          </div>

        </section>


        <div style={{ background: "#333333" }}>
          <div style={{ margin: "0 auto", maxWidth: "1400px", display: "flex", flexDirection: "row" }}>
            <div style={{ flex: "1" }}>
              <h2>Company</h2>
            </div>
            <div style={{ flex: "1" }}></div>
            <div style={{ flex: "1" }}></div>
            <div style={{ flex: "1" }}></div>
          </div>
        </div>

      </div>
    );
  }
}
