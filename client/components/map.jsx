import React, { Component } from 'react';
import { Polyline, Polygon, Map, TileLayer, Marker, Popup, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import Control from 'react-leaflet-control';

var details = {
  lat: -25.864170,
  lng: 28.209336,
  zoom: 3
}

var inBound = false;
var allDevices = undefined;
var deviceSelected = undefined;

var circleColor = "#4c8ef7";
var poly2tri = require('poly2tri');
var b = undefined;
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
    devicePathHistory: undefined,
    boundaryVisible: false,
    showBoundary: false
  }

  constructor(props) {
    super(props)
  }

  setvalues = (device) => {
    if (device.meta.ipLoc == undefined || device.meta.ipLoc == null) {
      device.meta.ipLoc = {
        ll:
          [
            0.01,
            0.01
          ]
      }
    } else if (device.meta.ipLoc != undefined || device.meta.ipLoc != null) {
      if (device.meta.ipLoc.ll == undefined || device.meta.ipLoc == null) {
        device.meta.ipLoc = {
          ll:
            [
              0.01,
              0.01
            ]
        }
      }
    }

    details.lat = device.meta.ipLoc.ll[0];
    details.lng = device.meta.ipLoc.ll[1];

    if (this.props.widget == true) {
      details.zoom = 13;
    } else {
      details.zoom = 14;
    }
  };

  getPopup = (marker) => {
    return (
      <Popup>
        <h5 className="popup" style={{ marginTop: "50%", position: "center" }} >{marker.devid}</h5>
      </Popup>
    )
  }

  checkBound = (marker) => {
    var result = undefined;
    var temp = [];

    var contour = [];

    for (var boundaryPoints in marker.boundaryLayer.boundaryPoints) {
      var t = marker.boundaryLayer.boundaryPoints[boundaryPoints];
      for (var points in t) {
        if (points == 1) {
          contour.push(new poly2tri.Point(t[0], t[1]));
        }
      }
    }

    var swctx = new poly2tri.SweepContext(contour);
    swctx.triangulate();
    var triangles = swctx.getTriangles();

    for (var t in triangles) {
      var trianglePoints = triangles[t].points_;
      var triangle = [];
      for (var j in trianglePoints) {
        triangle.push(trianglePoints[j])
      }
      temp.push(this.PointInTriangle({ x: marker.meta.ipLoc.ll[0], y: marker.meta.ipLoc.ll[1] }, triangle[0], triangle[1], triangle[2]));
    }

    for (var t in temp) {
      if (temp[t] == true) {
        result = true;
      }
    }

    if (result == undefined) {
      result = false;
    }
    inBound = result;
  }

  sign = (p1, p2, p3) => {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  getHistory = (marker, action) => {
    if (b == true) {
      return (
        <Polyline color="blue" positions={marker.devicePathHistory} />
      )
    } else {
      return (
        <div></div>
      )
    }
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

  boundaryButton = (device) => {
    if (device != undefined || device != null) {
      return (
        <button><i className="viewButton fas fa-route" title="Show Boundary" style={{ color: "black", fontSize: "20px", padding: 10 }} onClick={() => { this.boundaryButtonClicked() }}></i></button>
      )
    } else {
      return <span style={{ marginTop: "10px", marginRight: "22px" }}></span>;
    }

  }

  boundaryButtonClicked = () => {
    if (this.state.boundaryVisible == false) {
      this.setState({ boundaryVisible: true })
      this.setState({ showBoundary: true })
      b = true;
    } else if (this.state.boundaryVisible == true) {
      this.setState({ showBoundary: false })
      this.setState({ boundaryVisible: false })
      b = false;
    }
  }

  render() {
    allDevices = this.props.devices;
    deviceSelected = this.props.deviceCall;

    allDevices.map((p, index) => {
      if (deviceSelected != undefined) {
        if (p.devid == deviceSelected.devid) {
          this.setvalues(p);
        }
      }
    });

    var position = [details.lat, details.lng]
    var defaultLoc = {
      ll:
        [
          0.01,
          0.01
        ]
    }
    return (
      <Map className="map" center={position} zoom={details.zoom} doubleClickZoom={false}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Control position="topright" >
          {this.boundaryButton(deviceSelected)}
        </Control>
        {

          allDevices.map((marker) => {
            var gps = {
            }
            var bLayer = marker.boundaryLayer;

            if (bLayer == 0) {
              marker.boundaryLayer = undefined;
            }

            if (marker.selectedIcon == undefined) {
              fetch("/api/v3/selectedIcon", {
                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ key: marker.key, selectedIcon: false })
              })
                .then(response => response.json()).then(result => { console.log("Added Select Icon") })
                .catch(err => console.error(err.toString()));
            }

            if (marker.payload.data.gps != undefined) {
              if (marker.payload.data.gps.lat != undefined && marker.payload.data.gps.lon != undefined) {
                marker.meta.ipLoc = {
                  ll:
                    [
                      marker.payload.data.gps.lat,
                      marker.payload.data.gps.lon
                    ]
                }
              } else {
                if (marker.payload.data.gps.latitude != undefined && marker.payload.data.gps.longitude != undefined) {
                  marker.meta.ipLoc = {
                    ll:
                      [
                        marker.payload.data.gps.latitude,
                        marker.payload.data.gps.longitude
                      ]
                  }
                } else {
                  if (marker.meta.ipLoc == undefined || marker.meta.ipLoc == null) {
                    marker.meta.ipLoc = defaultLoc
                  } else if (marker.meta.ipLoc != undefined || marker.meta.ipLoc != null) {
                    if (marker.meta.ipLoc.ll == undefined || marker.meta.ipLoc.ll == null) {
                      marker.meta.ipLoc = defaultLoc
                    }
                  }
                }
              }
            } else {
              if (marker.meta.ipLoc == undefined || marker.meta.ipLoc == null) {
                marker.meta.ipLoc = defaultLoc
              } else if (marker.meta.ipLoc != undefined || marker.meta.ipLoc != null) {
                if (marker.meta.ipLoc.ll == undefined || marker.meta.ipLoc.ll == null) {
                  marker.meta.ipLoc = defaultLoc
                }
              }
            }

            if (marker.selectedIcon == true) {
              if (this.props.public == true) {
                return (
                  <div key={marker.devid}>
                    <Marker position={[marker.meta.ipLoc.ll[0], marker.meta.ipLoc.ll[1]]}>
                      {this.getPopup(marker)}
                    </Marker>
                  </div>
                )
              } else {
                if (marker.boundaryLayer == undefined || marker.boundaryLayer == null) {
                  return (
                    <div key={marker.devid}>
                      <FeatureGroup>
                        <EditControl
                          position='topleft'
                          onCreated={e => {
                            var latlngsArray = e.layer._latlngs;
                            var latlngs = [];
                            for (var x = 0; x < latlngsArray.length; x++) {
                              if (x == 0) {
                                var latlngsl = latlngsArray[x];
                                for (var latlng in latlngsl) {
                                  var k = [
                                    latlngsl[latlng].lat,
                                    latlngsl[latlng].lng
                                  ]
                                  latlngs.push(k)
                                }
                              }
                            }

                            var dev = marker;
                            dev.boundaryLayer = { boundaryPoints: latlngs };
                            { this.checkBound(dev); }

                            var b = {
                              boundaryPoints: latlngs,
                              inbound: inBound
                            }

                            fetch("/api/v3/boundaryLayer", {
                              method: "POST",
                              headers: { "Accept": "application/json", "Content-Type": "application/json" },
                              body: JSON.stringify({ key: marker.key, boundaryLayer: b })
                            }).then(response => response.json()).then(result => {
                            }).catch(err => console.error(err.toString()));

                          }}

                          onDeleted={e => {
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
                            polyline: false
                          }}
                        />
                      </FeatureGroup>
                      <Marker position={[marker.meta.ipLoc.ll[0], marker.meta.ipLoc.ll[1]]}>
                        {this.getPopup(marker)}
                      </Marker>
                    </div>
                  )
                } else if (marker.boundaryLayer != undefined || marker.boundaryLayer != null) {
                  { this.checkBound(marker); }
                  if (inBound) {
                    circleColor = "#4c8ef7";
                  } else {
                    circleColor = "red";
                  }


                  if (this.state.showBoundary == true) {
                    b = true;
                  } else {
                    b = false;
                  }

                  return (
                    <div key={marker.devid}>
                      <FeatureGroup >
                        <EditControl
                          position='topleft'
                          onEdited={e => {
                            e.layers.eachLayer(a => {
                              var p = []
                              for (var x in a._latlngs) {
                                if (x == 0) {
                                  var f = a._latlngs[x];
                                  for (var d in f) {
                                    var k = [
                                      f[d].lat,
                                      f[d].lng
                                    ]
                                    p.push(k)
                                  }
                                }
                              }
                              var b = {
                                boundaryPoints: p,
                                inbound: inBound
                              }

                              fetch("/api/v3/boundaryLayer", {
                                method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                                body: JSON.stringify({ key: marker.key, boundaryLayer: b })
                              }).then(response => response.json()).then(result => {
                                console.log(result);
                              }).catch(err => console.error(err.toString()));
                            });
                          }}

                          onDeleted={e => {
                            fetch("/api/v3/state/deleteBoundary", {
                              method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
                              body: JSON.stringify({ id: marker.devid })
                            }).then(response => response.json()).then(serverresponse => {
                              console.log(serverresponse)
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
                        <Polygon positions={marker.boundaryLayer.boundaryPoints} color={circleColor} />
                      </FeatureGroup>
                      {this.getHistory(marker, b)}
                      <Marker
                        position={[marker.meta.ipLoc.ll[0], marker.meta.ipLoc.ll[1]]}
                      >
                        {this.getPopup(marker)}
                      </Marker>
                    </div>
                  )
                }
              }
            }

            if (marker.selectedIcon == false && this.props.widget == true) {
              return (
                <div key={marker.devid}>
                </div>
              )
            } else if (marker.selectedIcon == false) {
              return (
                <div key={marker.devid}>
                  <Marker position={[marker.meta.ipLoc.ll[0], marker.meta.ipLoc.ll[1]]}>
                    {this.getPopup(marker)}
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
