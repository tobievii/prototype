import React from "react";
import { colors, theme } from "../theme"

export const Cards = (props) => {
    const cardstyles: any = { width: 250, background: colors.spotE, margin: 10, position: "relative", padding: "100px 5px 40px 5px" }
    const buttonstyles: any = { width: "100%", bottom: 0, left: 0, position: "absolute" }
    const cardtextstyle: any = { fontSize: "0.75em", lineHeight: "1.65em" }

    return (
        <section style={{ paddingTop: 50 }}>
            <div style={{ color: colors.spotB, maxWidth: 1000, display: "flex", margin: "0 auto" }}>
                <div style={cardstyles}>
                    <h2>Startup</h2>
                    <p style={cardtextstyle}>Link up to 5 devices with Dashboard and automation workflows.</p>
                    <button style={buttonstyles}>FREE</button>
                </div>
                <div style={cardstyles}>
                    <h2>Pro</h2>
                    <p style={cardtextstyle}>Unlimited device count. <br />Shared cluster with metered usage.</p>
                    <button style={buttonstyles}>Starting at $2.50/mo</button>
                </div>
                <div style={cardstyles}>
                    <h2>Business</h2>
                    <p style={cardtextstyle}>Unlimited device count. <br />Dedicated cloud instance. <br />Isolated hosting.</p>
                    <button style={buttonstyles}>Starting at $50/mo</button>
                </div>
                <div style={cardstyles}>
                    <h2>Enterprise</h2>
                    <p style={cardtextstyle}>Custom development.<br />Dedicated baremetal servers.<br />24/7 support</p>
                    <button style={buttonstyles}>Contact us</button>
                </div>
            </div>

        </section>
    )
}