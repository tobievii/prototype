import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';


export class MapDevices extends Component {
  state = {
    lat: -25.864170,
    lng: 28.209336,
    zoom: 13,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
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
      </Map>
    )
  }
}
