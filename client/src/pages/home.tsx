import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import "../prototype.scss"

export class Home extends React.Component {

    state = {

    }

    render() {
        return (
            <div style={{paddingTop: "5em", textAlign:"center"}}>
                
                    <h1>
                        Internet of Things for everyone.
                    </h1>
                    <h2>
                        Easily monitor and automate your world!
                    </h2>
                
            </div>
        );
    }
}

