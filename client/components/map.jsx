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
    
    var allDevices = this.props.devices;
    var deviceSelected = this.props.deviceCall;
    
    allDevices.map((p,index)=>{
      if(deviceSelected != undefined){
        if(p.devid == deviceSelected.e){
          this.setvalues(p);
        }
      }
    });

    var position = [details.lat, details.lng]

    allDevices.map((marker, index) => {
    });    
    
    return (
      <Map className="map" center={position} zoom={details.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          allDevices.map((marker, index) => {
            return(
              <Marker position={[details.lat, details.lng]} key={marker.devid}>
                <Popup>
                  <h5 className="popup">{marker.devid}</h5> <br />
                </Popup>
              </Marker>
            )
          })
        }
      </Map>
    )
  }
}
