import React, { Component } from 'react';
import { GeoJSON, Polygon, Map, TileLayer, Marker, Popup, Circle, FeatureGroup} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"

var details = {
  lat: -25.864170,
  lng: 28.209336,
  zoom: 2
}

var circleColor = "#4c8ef7";

const L = require('leaflet');

// const myIcon = L.icon({
//   iconUrl: 'https://image.flaticon.com/icons/svg/33/33622.svg',
//   iconSize: [30, 46],
//   iconAnchor: [15, 46],
//   popupAnchor: [0, -46]
// });

// const myIconSelected = L.icon({
//   iconUrl: 'https://image.flaticon.com/icons/svg/33/33622.svg',
//   iconSize: [34, 50],
//   iconAnchor: [19, 50],
//   popupAnchor: [0, -50]
// });

export class MapDevices extends Component {
  state = {

  }

  constructor(props){
    super(props);
    
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

  increaseBoundary = (device) => {    
    circleColor = "green"; 

    var lat = device.payload.data.boundary.lat;
    var lon = device.payload.data.boundary.lon;
    var radius = device.payload.data.boundary.radius + 5;

    fetch("/api/v3/data/post", {
      apikey : this.props.acc.apikey,
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: device.devid, data: {boundary: {lat: lat, lon: lon, radius: radius}} })
    }).then(response => response.json()).then(serverresponse => {
        console.log(serverresponse)
    }).catch(err => {console.error(err.toString());});
  }

  decreaseBoundary = (device) => {    
    circleColor = "green";

    var lat = device.payload.data.boundary.lat;
    var lon = device.payload.data.boundary.lon;
    var radius = device.payload.data.boundary.radius - 5;

    fetch("/api/v3/data/post", {
      apikey : this.props.acc.apikey,
      method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ id: device.devid, data: {boundary: {lat: lat, lon: lon, radius: radius}} })
    }).then(response => response.json()).then(serverresponse => {
        console.log(serverresponse)
    }).catch(err => {console.error(err.toString());});

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
      <Map className="map" center={position} zoom={details.zoom} doubleClickZoom={false}>

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

            if(marker.payload.data.boundary == undefined && marker.selectedIcon == true){
              return(
                <div key={marker.devid}>
                  <FeatureGroup layeradd={()=>{
                    console.log("layer added")
                  }}>
                    <EditControl
                      position='topleft'
                      onCreated={e => {
                        var latlngsArray = e.layer._latlngs;
                        var latlngs = [];
                        for(var x = 0; x < latlngsArray.length; x++){
                          if(x == 0){
                            var latlngsl = latlngsArray[x];
                            for(var latlng in latlngsl){
                              var k = [
                                latlngsl[latlng].lat,
                                latlngsl[latlng].lng
                              ]
                              latlngs.push(k)
                            }
                          }else{
                            console.log("Result had two latLongs.")
                          }
                        }
                        console.log(latlngs)
                        fetch("/api/v3/data/post", {
                          apikey : this.props.acc.apikey,
                          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                          body: JSON.stringify({ id: marker.devid, data: {boundary: latlngs }})
                        }).then(response => response.json()).then(serverresponse => {
                            console.log(serverresponse)
                            // fetch("/api/v3/boundaryLayer", {
                            //   method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            //   body: JSON.stringify({ key: marker.key, boundaryLayer: p})
                            // }).then(response => response.json()).then(result => { console.log("Added Boundary Layer") 
                            // }).catch(err => console.error(err.toString()));
                        }).catch(err => {console.error(err.toString());});

                      }}
                      onDeleted={this._onDeleted}
                      draw={{
                        circlemarker: false,
                        marker: false,
                        rectangle: false,
                        circle: false,
                        polyline: false
                      }}
                      layeradd={()=>{
                        console.log("layer added")
                      }}
                    />
                  </FeatureGroup>
                  <Marker  position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]}>
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
                        <Marker  position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]}>
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
                    <FeatureGroup >
                      <EditControl
                        position='topleft'
                        onEdited={e => {
                              e.layers.eachLayer(a => {
                                var t = a.toGeoJSON().geometry.coordinates;
                                var fina = [];
                                for(var r in t){
                                  fina = t[0];
                                }
                                console.log(fina)
                                fetch("/api/v3/data/post", {
                                  apikey : this.props.acc.apikey,
                                  method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: marker.devid, data: {boundary: fina }})
                                }).then(response => response.json()).then(serverresponse => {
                                    console.log(serverresponse)
                                }).catch(err => {console.error(err.toString());});
                            });
                          }
                        }
                        onDeleted={ e =>{
                          fetch("/api/v3/state/deleteBoundary", {
                            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({ id: marker.devid, username: this.props.username })
                          }).then(response => response.json()).then(serverresponse => {
                            console.log(serverresponse);
                          }).catch(err => console.error(err.toString()));
                        }}
                        draw={{
                          circlemarker: false,
                          marker: false,
                          rectangle: false,
                          circle: false,
                          polyline: false,
                          polygon: false
                        }}
                      />
                      <Polygon positions={marker.payload.data.boundary} />
                    </FeatureGroup>
                    <Polygon positions={marker.payload.data.boundary} />
                    <Marker 
                      position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} 
                      iconSize={[64, 80]} 
                      iconAnchor={[49, 80]} 
                      popupAnchor={[0, -80]}
                      height="80px" 
                      >
                      <Popup>
                        <h5 className="popup">{marker.devid}</h5> <br />
                      </Popup>
                    </Marker>
                  </div>
                )
              }else{
                return(
                  <div key={marker.devid}>
                    <Marker  position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]}>
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
