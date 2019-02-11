import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

var details = {
  lat: -25.864170,
  lng: 28.209336,
  zoom: 13
}

export class MapDevices extends Component {
  state = {
    lat: -25.864170,
    lng: 28.209336,
    zoom: 13
  }

  componentWillMount = () =>{
    this.setState({ devices: this.props.devices })
  }

  setvalues = (device) => {
    details.lat = device.payload.data.gps.lat
    details.lng = device.payload.data.gps.lon
  }

  render() {
    
    const position1 = [this.state.lat+1, this.state.lng]
    const position2 = [this.state.lat, this.state.lng+2]
    var allDevices = this.props.devices;
    var deviceSelected = this.props.deviceCall;
    
    allDevices.map((p,i)=>{
      if(deviceSelected != undefined){
        if(p.devid == deviceSelected.e){
          this.setvalues(p);
        }
      }
    })

    var position = [details.lat, details.lng]

    return (
      <Map className="map" center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <h4 className="popup">Iot.Nxt</h4> <br />
          </Popup>
        </Marker>
        <Marker position={position1}>
          <Popup>
            <h4 className="popup">Test1</h4> <br />
          </Popup>
        </Marker>
        <Marker position={position2}>
          <Popup>
            <h4 className="popup">Test2</h4> <br />
          </Popup>
        </Marker>
      </Map>
    )
  }
}
