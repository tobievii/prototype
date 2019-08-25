import React from "react";
import { Registration } from "../components/registration"

interface MyProps {
    getaccount: Function;
    history: any;
}

interface MyState {
    [index: string]: any
}

export class Home extends React.Component<MyProps, MyState> {

    state = {

    }

    render() {
        return (
            <div style={{ paddingTop: "2em", textAlign: "center" }}>
                <section>
                    <h1>Internet of Things for everyone.</h1>
                    <h2>Easily monitor and automate your world!</h2>
                </section>

                <section>
                    <Registration history={this.props.history} getaccount={this.props.getaccount} />
                </section>


            </div>
        );
    }
}

