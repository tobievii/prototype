import React from "react";
import { colors, theme } from "../theme"

export const Cards = (props) => {
    const cardstyles: any = { width: 250, background: colors.spotE, margin: 10, position: "relative", padding: "120px 5px 40px 5px" }
    const buttonstyles: any = { width: "100%", bottom: 0, left: 0, position: "absolute" }
    const cardtextstyle: any = { fontSize: "0.75em", lineHeight: "1.65em" }



    return (
        <section style={{ paddingTop: 50 }}>
            <div style={{ color: colors.spotB, maxWidth: 1000, display: "flex", margin: "0 auto" }}>
                <div className="cards" style={cardstyles}>
                    <img src="/svg/icon_1.svg" alt="icon_1" style={{ position: "absolute", display: "block", margin: 50, top: -60 }} />
                    <h2>Startup</h2>
                    <p style={cardtextstyle}>Link up to 5 devices with Dashboard and automation workflows.</p>
                    <button style={buttonstyles}>FREE</button>
                </div>
                <div className="cards" style={cardstyles}>
                    <img src="/svg/icon_2.svg" alt="icon_2" style={{ position: "absolute", display: "block", margin: 10, top: -30 }} />
                    <h2>Pro</h2>
                    <p style={cardtextstyle}>Unlimited device count. <br />Shared cluster with metered usage.</p>
                    <button style={buttonstyles}>Starting at $2.50/mo</button>
                </div>
                <div className="cards" style={cardstyles}>
                    <img src="/svg/icon_3.svg" alt="icon_3" style={{ position: "absolute", display: "block", margin: 40, top: -80 }} />
                    <h2>Business</h2>
                    <p style={cardtextstyle}>Unlimited device count. <br />Dedicated cloud instance. <br />Isolated hosting.</p>
                    <button style={buttonstyles}>Starting at $50/mo</button>
                </div>
                <div className="cards" style={cardstyles}>
                    <img src="/svg/icon_4.svg" alt="icon_4" style={{ position: "absolute", display: "block", margin: -20, top: -20 }} />
                    <h2>Enterprise</h2>
                    <p style={cardtextstyle}>Custom development.<br />Dedicated baremetal servers.<br />24/7 support</p>
                    <button style={buttonstyles}>Contact us</button>
                </div>
            </div>

        </section>
    )
}