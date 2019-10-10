import React from "react";

import { colors } from "../theme";
import { Hero } from "./herolanding"

interface MyProps { }

interface MyState {
  //[index: string]: any
}

export class Landing extends React.Component<MyProps, MyState> {
  state = {};

  render() {



    const cardstyles: any = {
      flex: "1",
      padding: colors.padding * 2,
      boxSizing: "border-box"
    }

    const cardstylewrap: any = { ...colors.cardShadow, ...{ height: 300 } };

    //   //background: "rgb(35, 35, 35)",
    //   background: "rgb(40,40,40)",
    //   width: "100%",
    //   height: 300,
    //   position: "relative",
    //   boxSizing: "border-box",
    //   boxShadow: "0px 10px 15px -2px rgba(0,0,0,0.25)",
    //   border: colors.borders,
    //   borderTop: "2px solid rgba(255, 255, 255, 0.15)"
    // }

    const buttonstyles: any = {
      bottom: 0, width: "100%",
      position: "absolute", padding: colors.padding * 2, fontSize: "120%",
      border: "none"
    }
    const cardtextstyle: any = {}

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


          <div className="landingBannerBg" style={landingheroSegmentStyle.wrapper}>

            <div style={landingheroSegmentStyle.subwrap}>

              <div style={landingheroSegmentStyle.svgblock}>
                <Hero />
              </div>

              <div style={{ ...landingheroSegmentStyle.textblock, ...{ paddingTop: 100, paddingBottom: 100 } }}>
                <h1 style={{ paddingRight: 20 }}>Internet of things for everyone.</h1>
                <p style={{ ...colors.p, ...{ color: "#cccccc" } }}>
                  Open-Source.<br />
                  Connect any device, any process. <br />
                  Script custom data processes in JS/TS<br />
                  Build custom interfaces easily.
                </p>
                <a href="https://github.com/IoT-nxt/prototype">
                  <button style={{ ...colors.quickShadow, ...{ fontSize: "120%" } }}>
                    <i className="fab fa-github" /> Source</button></a>
                <a href="/register">
                  <button style={{
                    ...colors.quickShadow,
                    ...{
                      fontSize: "120%", background: colors.good,
                      color: "#fff", fontWeight: "bold"
                    }
                  }}>
                    <i className="fa fa-user-plus" /> Register FREE* account</button></a>
              </div>
            </div>
          </div>

          <div style={devicelistSegmentWrapperStyle}>
            <div style={devicelistSegmentWrapperSubStyle}>
              <div style={{ flex: 1, padding: colors.padding * 2 }}>
                <img style={{ width: "100%" }} src="/img/landingPage_devicelist.gif" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ padding: colors.padding * 2, paddingTop: 80 }}>
                  <h1>Devicelist</h1>
                  <p style={colors.p}>Quickly see alarm, warning, share or public status of devices while the map view shows you where you need to focus.</p>
                </div>
              </div>
            </div>
          </div>

        </div>



        <div style={{}}>
          <div style={landingSegmentWrapperStyle}>
            <div style={{ flex: 1, padding: colors.padding * 2 }}>
              <h1>Dashboard</h1>
              <p style={colors.p}>Drag and drop new buttons, graphs and gauges. Powerful API to build your own widgets.</p>
            </div>

            <div style={{ flex: 1, padding: colors.padding * 2 }}>
              <img style={{ width: "100%" }} src="/img/landing_dashboard.gif" />
            </div>
          </div>



          <div style={landingSegmentWrapperStyle}>
            <div style={{ flex: 1, padding: colors.padding * 2 }}>
              <h1>Editor</h1>
              <p style={colors.p}>Script the behaviour of your devices directly in the browser. Easily count events, automate actions and gain value from data.</p>
            </div>

            <div style={{ flex: 1, padding: colors.padding * 2 }}>
              <img style={{ width: "100%" }} src="/img/landing_editor.gif" />
            </div>

          </div>

        </div>

        <div style={{ paddingTop: 50, paddingBottom: 50, background: "rgba(255,255,255,0.05)" }}>

          <div style={{ color: "#CCCCCC", maxWidth: 1400, margin: "0 auto", padding: colors.padding * 2 }}>
            <h1>Hosted service</h1>
            <p style={colors.p}>We offer both free accounts and paid services for those who just want have a
            quick test drive, or do not want the hassle of running their own cloud infrastructure. </p>
          </div>

          <div style={{ color: "#CCCCCC", maxWidth: 1400, display: "flex", flexDirection: "row", margin: "0 auto" }}>

            <div style={cardstyles}>
              <div style={{ ...cardstylewrap, ...{ borderTop: "1px solid " + colors.good } }}>
                <div style={{ padding: colors.padding * 2 }}>
                  <h2 style={{ color: colors.good }}>Free</h2>
                  <p style={colors.p}>
                    5 devices max<br />
                    300MB per month<br />
                    Community support
                  </p>
                </div>

                <button style={{
                  ...buttonstyles, ...colors.quickShadow,
                  ...{ background: colors.good, color: "#fff", fontWeight: "bold" }
                }}>
                  <i className="fas fa-arrow-right" /> Click here</button>
              </div>
            </div>

            <div style={cardstyles}>
              <div style={{ ...cardstylewrap, ...{ borderTop: "1px solid " + colors.warning } }}>
                <div style={{ padding: colors.padding * 2 }}>
                  <h2 style={{ color: colors.warning }}>Pro</h2>
                  <p style={colors.p}>Unlimited* device count. <br />
                    30,000MB per month<br />
                    Domain pointing<br />
                    Support included
                  </p>
                </div>
                <div style={buttonstyles}>From $2.50/mo</div>
              </div>
            </div>

            <div style={cardstyles}>
              <div style={{ ...cardstylewrap, ...{ borderTop: "1px solid " + colors.alarm } }}>
                <div style={{ padding: colors.padding * 2 }}>
                  <h2 style={{ color: colors.alarm }}>Business</h2>
                  <p style={colors.p}>
                    Unlimited* device count. <br />
                    60,000MB+ per month per user<br />
                    Domain pointing<br />
                    Business management<br />
                    Priority support<br />
                  </p>
                </div>
                <div style={buttonstyles}>From $5/user/mo</div>
              </div>
            </div>

            <div style={cardstyles}>
              <div style={{ ...cardstylewrap, ...{ borderTop: "1px solid " + colors.public } }}>
                <div style={{ padding: colors.padding * 2 }}>
                  <h2 style={{ color: colors.public }}>Enterprise</h2>
                  <p style={colors.p}>
                    Business account plus:<br />
                    Custom development.<br />
                    Dedicated baremetal servers.<br />
                    VIP support</p>
                </div>
                <a href="https://www.iotnxt.com/#section-contact"><button style={buttonstyles}>Contact us</button></a>
              </div>
            </div>

          </div>

          <div style={{ color: "#CCCCCC", maxWidth: 1400, display: "flex", flexDirection: "row", margin: "0 auto" }}>
            <p style={colors.p} >* Unlimited devices, but you'll still be capped by data usage limits to avoid system abuse.</p>
          </div>
        </div>


        <div style={{ background: "rgba(255,255,255,0.1)" }}>
          <div style={{ margin: "0 auto", maxWidth: "1400px", display: "flex", flexDirection: "row", paddingTop: 100, paddingBottom: 100 }}>
            <div style={{ flex: "1", padding: colors.padding * 2 }}>
              <h2>PR0T0TYP3</h2>
            </div>

            <div style={{ flex: "1" }}>
              <a href="https://www.iotnxt.com">About</a> <br />
              <a href="https://www.iotnxt.com/#section-2">Partners</a><br />
              <a href="https://www.iotnxt.com/#section-5">Framework</a><br />
              <a href="https://www.iotnxt.com/#section-9">Awards</a>
            </div>

            <div style={{ flex: "1" }}>
              <a href="https://github.com/IoT-nxt/prototype">Opensource</a> <br />
              <a href="https://github.com/IoT-nxt/prototype#documentation">Documentation</a><br />
              <a href="https://discord.gg/rTQmvbT">Community</a><br />
              <a href="https://discord.gg/rTQmvbT">Help</a>
            </div>

            <div style={{ flex: "1", padding: colors.padding * 2, fontSize: "150%", textAlign: "right" }}>
              <a className="footerButton" href="https://discord.gg/rTQmvbT"><i className="fab fa-discord"></i></a>&nbsp;
              <a className="footerButton" href="https://github.com/IoT-nxt/prototype"><i className="fab fa-github"></i></a>
            </div>
          </div>
        </div>

      </div >
    );
  }
}
