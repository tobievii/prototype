import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, Circle} from 'react-leaflet';

var details = {
  lat: -25.864170,
  lng: 28.209336,
  zoom: 2
}

const outer = [[-25.864170, 28.209336], [25.864170, -28.209336]]

const L = require('leaflet');

// const myIcon = L.icon({
//   iconUrl: 'https://image.flaticon.com/icons/svg/33/33622.svg',
//   iconSize: [30, 46],
//   iconAnchor: [15, 46],
//   popupAnchor: [0, -46]
// });

// const myIconSelected = L.icon({
//   iconUrl: 'https://image.flaticon.com/icons/svg/33/33622.svg',
//   iconSize: [30, 46],
//   iconAnchor: [15, 46],
//   popupAnchor: [0, -46]
// });

export class MapDevices extends Component {
  state = {
    bounds: outer,
    circleColor: "blue"
  }

  componentWillMount = () =>{
    this.setState({ devices: this.props.devices })
  }

  setvalues = (device) => {
    details.lat = device.payload.data.gps.lat;
    details.lng = device.payload.data.gps.lon;
    details.zoom = 17;
  }

  mouseclick = () => {
    alert("Lat, Lon: "+ e.latlng.lat+", " + e.latlng.lng)
  }

  circleClicked = () => {
    console.log("circle clicked");
    this.setState({ circleColor: "green" })
  }

  render() {
    var allDevices = this.props.devices;
    var deviceSelected = this.props.deviceCall;

    allDevices.map((p,index)=>{
      if(deviceSelected != undefined){
        if(p.devid == deviceSelected.devid){
          this.setvalues(p);
        }
      }
    });
    var position = [details.lat, details.lng]   
  
    return (
      <Map className="map" center={position} zoom={details.zoom} >

        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Rectangle
          bounds={outer}
          color={this.state.bounds === outer ? 'red' : 'white'}
          onClick={this.onClickOuter}
        /> */}

        {
          allDevices.map((marker, index) => {
            if(marker.selectedIcon == undefined){
              fetch("/api/v3/selectedIcon", {
                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ key: marker.key, selectedIcon:false })
              }).then(response => response.json()).then(result => { console.log("Added Select Icon") })
                .catch(err => console.error(err.toString()));
            }

            if(marker.payload.data.boundary == undefined){
              console.log("logged")
              return(
                <div key={marker.devid}>
                  <Marker  position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} >
                    <Popup>
                      <h5 className="popup">{marker.devid}</h5> <br />
                    </Popup>
                  </Marker>
                </div>
              )
            }else{
              var gps = {
              }
        
              if(marker.payload.data.gps == undefined){

                fetch("/api/v3/getlocation", {
                  apikey : this.props.acc.apikey,
                  method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                  body: JSON.stringify({ id: marker.devid})
                }).then(response => response.json()).then(serverresponse => {
                  gps = serverresponse.result;
    
                  fetch("/api/v3/data/post", {
                    apikey : this.props.acc.apikey,
                    method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({ id: marker.devid, data: gps })
                  }).then(response => response.json()).then(serverresponse => {
                    return(
                      <div key={marker.devid}>
                        <Marker  position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} >
                          <Popup>
                            <h5 className="popup">{marker.devid}</h5> <br />
                          </Popup>
                        </Marker>
                      </div>
                    )
                  }).catch(err => {console.error(err.toString()); return <div>No Data</div>;});
                }).catch(err => {console.error(err.toString()); return <div>No Data</div>;});

              }else if(marker.selectedIcon == true && marker.payload.data.boundary != undefined){

                return(
                  <div key={marker.devid}>
                    <Circle  onclick={()=>this.circleClicked()} color={this.state.circleColor} center={[marker.payload.data.boundary.lat, marker.payload.data.boundary.lon]} radius={marker.payload.data.boundary.radius} />
                    <Marker position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} >
                      <Popup>
                        <h5 className="popup">{marker.devid}</h5> <br />
                      </Popup>
                    </Marker>
                  </div>
                )
              }else{
                return(
                  <div key={marker.devid}>
                    <Marker  position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} >
                      <Popup>
                        <h5 className="popup">{marker.devid}</h5> <br />
                      </Popup>
                    </Marker>
                  </div>
                )
              }
            }
          })
        }
      </Map>
    )
  }
}
