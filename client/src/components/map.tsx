import React from "react";
import Map from "pigeon-maps";
import Marker from "./mapmarker";
import { api } from "../api";
import { colors } from "../theme";
import { CorePacket } from "../../../server/shared/interfaces";
interface MapProps { }
interface MapState { }

export class ProtoMap extends React.Component<MapProps, MapState> {
  state = {
    width: 800,
    height: 400,
    resizing: false,
    zoom: 8,
    center: undefined
  };

  mapwrapper;

  constructor(props) {
    super(props);
    this.mapwrapper = React.createRef();
  }



  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    this.calculateCenterFromDeviceLocations();
    api.on("states", this.calculateCenterFromDeviceLocations)
    api.on("mapGoto", this.gotoDevice)
  }

  gotoDevice = (device: CorePacket) => {
    console.log("mapGoto", device);
    if (device.data) {
      if (device.data.gps) {
        if ((device.data.gps.lat) && (device.data.gps.lon)) {
          var center = [device.data.gps.lat, device.data.gps.lon]
          console.log(center);
          this.setState({ center, zoom: 14 })
        }
      }
    }

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    api.removeListener("states", this.calculateCenterFromDeviceLocations);
    api.removeListener("mapGoto", this.gotoDevice);
  }

  updateDimensions = () => {
    if (this.mapwrapper) {
      console.log("updating..");

      var vals = {
        resizing: true,
        width: this.mapwrapper.current.offsetWidth,
        height: this.mapwrapper.current.offsetHeight
      };
      if (vals.width < 100) {
        vals.width = 100;
      }
      if (vals.height < 100) {
        vals.width = 100;
      }

      // workaround where pidgeon map wont size down:
      this.setState(vals, () => {

        setTimeout(() => {
          this.setState({ resizing: false });
        }, 600);
      });
    }
  };

  wheelHandler = e => {
    console.log(e);
    console.log("mousewheel:" + e.deltaY);
    var zoom =
      e.deltaY < 0
        ? Math.min(this.state.zoom + 1, 18)
        : Math.max(this.state.zoom - 1, 1);
    this.setState({ zoom });
  };

  onBoundsChanged = e => {
    //console.log(e);
    this.setState({ center: e.center });
  };

  mouseMove = e => {
    // todo improve zoom location, perhaps using tag locations
    // console.log(e.clientX);
  };

  handleMarkerClick = ({ event, payload, anchor }) => {
    console.log(`Marker #${payload} clicked at: `, anchor);
  };

  /** TODO: move to seperate component just for showing loading spinners. */
  displayLoading() {
    return <div style={{
      color: "rgba(255,255,255,0.1)",
      display: "flex",
      flexDirection: "column",
      padding: 0,
      margin: 0,
      height: "100%",
      boxSizing: "border-box"
    }}>

      <div style={{ flex: 1, textAlign: "center", position: "relative", width: "100%" }}>
        <div style={{ textAlign: "center", position: "absolute", bottom: 10, width: "100%" }}>
          <div className="fa-3x">
            <i className="fas fa-circle-notch fa-spin"></i>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, textAlign: "center", width: "100%", paddingTop: 0 }}>loading map</div>
    </div>
  }

  calculateCenterFromDeviceLocations = () => {

    /** if we already have a position do not re center on every packet. */
    if (this.state.center) {
      if ((this.state.center[0] == 0) && (this.state.center[1] == 0)) {
        //continue...
      } else {
        return;
      }

    }
    var center = [0, 0];

    if (api.mapFocusDevice) {
      if (api.mapFocusDevice.data) {
        if (api.mapFocusDevice.data.gps) {
          var gps = api.mapFocusDevice.data.gps;
          if ((gps.lat) && (gps.lon)) {
            this.gotoDevice(api.mapFocusDevice);
            return;
          }
        }
      }
    }

    var devicegpslocsLat = []
    var devicegpslocsLon = []

    console.log(api.data.states)


    for (var state of api.data.states) {
      if (state.data) {
        if (state.data.gps) {
          if ((state.data.gps.lon) && (state.data.gps.lat)) {
            devicegpslocsLon.push(parseFloat(state.data.gps.lon))
            devicegpslocsLat.push(parseFloat(state.data.gps.lat))
          }
        }
      }
    }


    if (devicegpslocsLon.length > 0) {
      var totalTempLon = 0;
      for (var lon of devicegpslocsLon) {
        totalTempLon += lon;
      }
      totalTempLon /= devicegpslocsLon.length;
      center[1] = totalTempLon;
    }

    if (devicegpslocsLat.length > 0) {
      var totalTempLat = 0;
      for (var lat of devicegpslocsLat) {
        totalTempLat += lat;
      }
      totalTempLat /= devicegpslocsLat.length;
      center[0] = totalTempLat;
    }

    console.log(center);
    this.setState({ center });
  }

  render() {

    if (this.state.resizing) {
      return this.displayLoading();
    }


    return (
      <div
        style={{
          background: colors.panels,
          boxSizing: "border-box",
          margin: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden"
        }}
        ref={this.mapwrapper}
      >
        {this.state.resizing ? (
          <div style={{ width: "100%", height: "100%" }}>loading...</div>
        ) : (
            <div
              style={{ width: "100%", height: "100%" }}
              onMouseMove={this.mouseMove}
              onWheel={this.wheelHandler}
            >

              {(this.state.center) &&
                <Map
                  onBoundsChanged={this.onBoundsChanged}
                  attribution={false}
                  animate={true}
                  center={this.state.center}
                  zoom={this.state.zoom}
                  width={this.state.width}
                  height={this.state.height}
                >
                  {api.data.states.map((dev, i) => {
                    if (!dev.data) {
                      return;
                    }
                    if (!dev.data.gps) {
                      return;
                    }
                    if (!dev.data.gps.lat) {
                      return;
                    }
                    if (!dev.data.gps.lon) {
                      return;
                    }
                    return (
                      <Marker
                        device={dev}
                        key={i}
                        anchor={[dev.data.gps.lat, dev.data.gps.lon]}
                        payload={1}
                        onClick={this.handleMarkerClick}
                      />
                    );
                  })}
                </Map>}
            </div>
          )}
      </div>
    );
  } //end render
}
