import React, { Component } from 'react';
import { Polygon, Map, TileLayer, Marker, Popup, FeatureGroup} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"

var details = {
  lat: -25.864170,
  lng: 28.209336,
  zoom: 3
}

var circleColor = "#4c8ef7";

const L = require('leaflet');

// const myIcon = L.icon({
//   iconUrl: '../markers/marker_Blue.png',
//   iconSize: [80, 96],
//   iconAnchor: [65, 96],
//   popupAnchor: [0, -96]
// });

// const selectedIcon = L.icon({
//   iconUrl: '../markers/marker_Red.svg',
//   iconSize: [80, 96],
//   iconAnchor: [40, 96],
//   popupAnchor: [0, -96]
// });

export class MapDevices extends Component {
  state = {
  }

  setvalues = (device) => {
    details.lat = device.payload.data.gps.lat;
    details.lng = device.payload.data.gps.lon;
    if(this.props.widget == true){
      details.zoom = 13;
    }else{
      details.zoom = 17;
    }
  };

  sign = (p1, p2, p3) => {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }
  
  PointInTriangle = (pt, v1, v2, v3) => {
    var d1, d2, d3;
    var has_neg, has_pos;
  
    d1 = this.sign(pt, v1, v2);
    d2 = this.sign(pt, v2, v3);
    d3 = this.sign(pt, v3, v1);
  
    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
  
    return !(has_neg && has_pos);
  }
  
  // var device = {
  //   id: "asdasd",
  //   data: {
  //     gps: {
  //       lat: 25.00,
  //       lon: 25.00
  //     }
  //   }
  // };

  // var tri = [
  //   { x: 20, y: 20 },
  //   { x: 30, y: 25 },
  //   { x: 25, y: 30 }
  // ];

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
        {
          allDevices.map((marker, index) => {
            var gps = {
            }

            if(marker.selectedIcon == undefined){
              fetch("/api/v3/selectedIcon", {
                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ key: marker.key, selectedIcon:false })
              }).then(response => response.json()).then(result => { console.log("Added Select Icon") })
                .catch(err => console.error(err.toString()));

            }else if(marker.payload.data.gps == undefined){

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
                }).catch(err => {console.error(err.toString());});
              }).catch(err => {console.error(err.toString());});
            }
              
            if(marker.selectedIcon == true && marker.payload.data.boundary == undefined){
              return(
                <div key={marker.devid}>
                  <FeatureGroup>
                    <EditControl
                      position='topleft'
                      onCreated={e => {
                        var latlngsArray = e.layer._latlngs;
                        var latlngs = [];
                        var triangles = [];
                        var triangle = [];
                        for(var x = 0; x < latlngsArray.length; x++){
                          if(x == 0){
                            var latlngsl = latlngsArray[x];
                            var count = 0;
                            for(var latlng in latlngsl){
                              var k = [
                                latlngsl[latlng].lat,
                                latlngsl[latlng].lng
                              ]
                              if(count < 3){
                                triangle.push({
                                  x: latlngsl[latlng].lat,
                                  y: latlngsl[latlng].lng
                                })
                                if(count == 2){
                                  triangles.push(triangle);
                                }
                              }else if(count >= 3){
                                triangle = [];
                                count = 0;
                                triangle.push({
                                  x: latlngsl[latlng].lat,
                                  y: latlngsl[latlng].lng
                                })
                              }
                              console.log(triangles)
                              console.log(triangle)
                              count ++;
                              latlngs.push(k)
                            }
                          }
                        }
                        
                        fetch("/api/v3/boundaryLayer", {
                          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                          body: JSON.stringify({ key: marker.key, boundaryLayer: triangles})
                        }).then(response => response.json()).then(result => {
                          fetch("/api/v3/data/post", {
                            apikey : this.props.acc.apikey,
                            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({ id: marker.devid, data: {boundary: latlngs }})
                          }).then(response => response.json()).then(serverresponse => {
                          }).catch(err => {console.error(err.toString());});
                        }).catch(err => console.error(err.toString()));
                        
                      }}
                      onDeleted={this._onDeleted}
                      draw={{
                        circlemarker: false,
                        marker: false,
                        rectangle: false,
                        circle: false,
                        polyline: false
                      }}
                    />
                  </FeatureGroup>
                  <Marker position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]}>
                    <Popup>
                      <h5 className="popup">{marker.devid}</h5> <br />
                    </Popup>
                  </Marker>
                </div>
              )
            }else if(marker.selectedIcon == true && marker.payload.data.boundary != undefined){
              var set;
              var shapeColor = "";

              for(var h in marker.boundaryLayer){
                var d = marker.boundaryLayer[h];
                var t = undefined;
                var result = this.PointInTriangle({ x: marker.payload.data.gps.lat, y: marker.payload.data.gps.lon }, d[0], d[1], d[2]);
                console.log(result)
              }

              return(
                <div key={marker.devid}>
                  <FeatureGroup >
                    <EditControl
                      position='topleft'
                      onEdited={e => {
                        e.layers.eachLayer(a => {
                          var p = []
                          for(var x in a._latlngs){
                            if(x == 0){
                              var f = a._latlngs[x];
                              for(var d in f){
                                var k = [
                                  f[d].lat,
                                  f[d].lng
                                ]
                                p.push(k)
                              }
                            }
                          }
                              
                          fetch("/api/v3/boundaryLayer", {
                            method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({ key: marker.key, boundaryLayer: a._bounds})
                          }).then(response => response.json()).then(result => {
                            fetch("/api/v3/data/post", {
                              apikey : this.props.acc.apikey,
                              method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                              body: JSON.stringify({ id: marker.devid, data: {boundary: p }})
                            }).then(response => response.json()).then(serverresponse => {
                            }).catch(err => {console.error(err.toString());});
                          }).catch(err => console.error(err.toString()));        
                        });
                      }}

                      onDeleted={ e =>{
                        fetch("/api/v3/state/deleteBoundary", {
                          method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                          body: JSON.stringify({ id: marker.devid, username: this.props.username })
                        }).then(response => response.json()).then(serverresponse => {
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

                  <Marker 
                    position={[marker.payload.data.gps.lat, marker.payload.data.gps.lon]} 
                    riseOnHover={true}
                    zIndexOffset={100}
                    openPopup={true}
                    >
                    <Popup>
                      <h5 className="popup">{marker.devid}</h5> <br />
                    </Popup>
                  </Marker>
                </div>
              )
            }

            if(marker.selectedIcon == false && this.props.widget == true){
              return(
                <div key={marker.devid}>
                </div>
              )
            }else if(marker.selectedIcon == false){
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
          })
        }
      </Map>
    )
  }
}
