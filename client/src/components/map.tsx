import React from "react";
import Map from 'pigeon-maps'

interface MapProps { }
interface MapState { }

export class ProtoMap extends React.Component<MapProps, MapState> {
    state = {
        width: 800,
        height: 400,
        resizing: false,
        zoom: 5,
        center: [-28.825355905602482, 24.968895574177196]
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

        if (this.mapwrapper) {
            console.log("updating..")

            var vals = { resizing: true, width: this.mapwrapper.current.offsetWidth, height: this.mapwrapper.current.offsetHeight }
            if (vals.width < 100) { vals.width = 100 }
            if (vals.height < 100) { vals.width = 100 }

            // workaround where pidgeon map wont size down:
            this.setState(vals, () => {
                setTimeout(() => {
                    this.setState({ resizing: false })
                }, 100)
            })
        }
    }

    wheelHandler = (e) => {
        console.log("mousewheel:" + e.deltaY)
        var zoom = (e.deltaY < 0) ? Math.min(this.state.zoom + 1, 18) : Math.max(this.state.zoom - 1, 1)
        this.setState({ zoom })
    }

    onBoundsChanged = (e) => {
        console.log(e);
        this.setState({ center: e.center })
    }
    render() {
        return (<div
            style={{
                boxSizing: "border-box",
                background: "#fff",
                margin: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden"
            }}
            ref={this.mapwrapper}
        >
            {(this.state.resizing)
                ? (<div style={{ width: "100%", height: "100%" }}></div>)
                : (<div style={{ width: "100%", height: "100%" }} onWheel={this.wheelHandler}>
                    <Map
                        onBoundsChanged={this.onBoundsChanged}
                        attribution={false}
                        animate={true}
                        center={this.state.center}
                        zoom={this.state.zoom}
                        width={this.state.width}
                        height={this.state.height}></Map>
                </div>)}
        </div>)
    } //end render
}

