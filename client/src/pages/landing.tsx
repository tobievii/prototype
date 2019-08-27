import React from "react";
import { Registration } from "../components/registration"
import { colors, theme } from "../theme"

import { Cards } from "./cards"

interface MyProps { }

interface MyState {
    //[index: string]: any
}

export class Landing extends React.Component<MyProps, MyState> {

    state = {}

    render() {
        return (
            <div style={{ paddingTop: "2em", textAlign: "center" }}>
                <section>
                    <h1>Internet of Things for everyone.</h1>
                    <h2>Easily monitor and automate your world!</h2>
                </section>

                <Registration />
                <Cards />
            </div>
        );
    }
}

