import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

var details = {
  lat: -25.864170,
  lng: 28.209336,
  zoom: 13
}

export class MapDevices extends Component {
  state = {
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
    
    return (
      <Map className="map" center={position} zoom={details.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          allDevices.map((marker, index) => {
            var gps = {
            }
      
            if(marker.payload.data.gps == undefined ){
              fetch("/api/v3/getlocation", {
                apikey : this.props.acc.apikey,
                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ id: marker.devid})
              }).then(response => response.json()).then(serverresponse => {
                gps = serverresponse.result;
                marker.payload.data.gps.lat = serverresponse.result.gps.lat;
                marker.payload.data.gps.lon = serverresponse.result.gps.lon;

                fetch("/api/v3/data/post", {
                  apikey : this.props.acc.apikey,
                  method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                  body: JSON.stringify({ id: marker.devid, data: gps })
                }).then(response => response.json()).then(serverresponse => {
                  return(
                    <Marker position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} key={marker.devid}>
                      <Popup>
                        <h5 className="popup">{marker.devid}</h5> <br />
                      </Popup>
                    </Marker>
                  )
                }).catch(err => {console.error(err.toString()); return <div>No Data</div>;});
              }).catch(err => {console.error(err.toString()); return <div>No Data</div>;});
            }else{
              return(
                <Marker position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} key={marker.devid}>
                  <Popup>
                    <h5 className="popup">{marker.devid}</h5> <br />
                  </Popup>
                </Marker>
              )
            }
          })
        }
      </Map>
    )
  }
}
