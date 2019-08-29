import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import MapView, { Marker } from 'react-native-maps';
import { Dimensions, Alert, Text } from 'react-native';

const { width, height } = Dimensions.get('window');
var devices = require('../devices');
var temp = []
const SCREEN_HIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DELTA = 0.0922;
const LONGTITUDE_DELTA = LATTITUDE_DELTA * ASPECT_RATIO;
export class MapViewContainer extends React.Component<NavigationScreenProps> {

  constructor(props: any) {
    super(props);

    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      markedPosition: {
        latitude: 0,
        longitude: 0,
      },
    };
  }

  watchID: number = null;

  componentDidMount() {
    this.devicesLocations()
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var lon = parseFloat(position.coords.longitude);
      var initRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: LATTITUDE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA,
      };
      this.setState({ initialPosition: initRegion });
      this.setState({ markedPosition: initRegion });
    },

      (error) => alert(JSON.stringify(error)),

      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lat = parseFloat(position.coords.latitude);
      var lon = parseFloat(position.coords.longitude);
      var lastRegion;
      this.setState({ markedPosition: lastRegion });

    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  devicesLocations() {
    {
      for (var i in devices.devices) {
        if (devices.devices[i].data.gps) {
          temp.push(devices.devices[i])
        }
      }
    }
  }

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        region={this.state.initialPosition}
        showsUserLocation={true}>
        {temp.map((marker, i) => (
          <Marker key={i}
            title={marker.id}
            coordinate={marker.data.gps}
          >{marker.Id}</Marker>
        ))}
      </MapView>
    );
  }
}
