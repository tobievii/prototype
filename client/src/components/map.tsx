import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Link, NavLink } from 'react-router-dom'
import { api } from "../api"
import { User } from "../../../server/shared/interfaces"
import { colors } from "../theme";

import Map from 'pigeon-maps'

// import Marker from 'pigeon-marker/react'

import Overlay from 'pigeon-overlay'

interface MyProps { }
interface MyState { }

export class ProtoMap extends React.Component<MyProps, MyState> {


    state = {
        width: 800,
        height: 400,
        resizing: false,
        zoom: 12
    }
    mapwrapper;

    constructor(props) {
        super(props);
        this.mapwrapper = React.createRef();
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions = () => {

        console.log("updating..")
        if (this.mapwrapper) {

            var vals = { resizing: true, width: this.mapwrapper.current.offsetWidth, height: this.mapwrapper.current.offsetHeight }

            if (vals.width < 100) { vals.width = 100 }
            if (vals.height < 100) { vals.width = 100 }

            this.setState(vals, () => {
                setTimeout(() => {
                    this.setState({ resizing: false })
                }, 100)
            })
        }
    }



    wheelHandler = (e) => {
        console.log(e.deltaY)
        if (e.deltaY < 0) {
            this.setState({
                zoom: Math.min(this.state.zoom + 1, 18)
            })
        } else {
            this.setState({
                zoom: Math.max(this.state.zoom - 1, 1)
            })
        }
    }



    render() {

        return <div style={{ boxSizing: "border-box", background: "#fff", margin: 0, width: "100%", height: "100%", overflow: "hidden" }} ref={this.mapwrapper}>
            {(this.state.resizing)
                ? (<div style={{ width: "100%", height: "100%" }}></div>)
                : (<div style={{ width: "100%", height: "100%" }} onWheel={this.wheelHandler}>
                    <Map
                        attribution={false}
                        animate={true}
                        center={[50.879, 4.6997]}
                        zoom={this.state.zoom}
                        width={this.state.width}
                        height={this.state.height}></Map>
                </div>)}

        </div>



    }
}

