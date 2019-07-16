import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import MapView from 'react-native-maps';
import {Dimensions, Alert} from 'react-native';

const {width, height} = Dimensions.get('window');

const SCREEN_HIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATTITUDE_DELTA = 0.0922;
const LONGTITUDE_DELTA = LATTITUDE_DELTA * ASPECT_RATIO;

export class SupportContainer extends React.Component<NavigationScreenProps> {

  constructor(props: any) {
    super(props);

    this. state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      markedPosition: {
        latitude: 0,
        longitude: 0,
      }
    };
  }

  watchID: number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = parseFloat(position.coords.latitude)
      const lon = parseFloat(position.coords.longitude)
      const initRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: LATTITUDE_DELTA,
        longitudeDelta: LONGTITUDE_DELTA
      };
      this.setState({initialPosition: initRegion})
      this.setState({markedPosition: initRegion})
    }, (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      const lat = parseFloat(position.coords.latitude);
      const lon = parseFloat(position.coords.longitude);

      const lastRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: LONGTITUDE_DELTA,
        longitudeDelta: LATTITUDE_DELTA,
      };

      this.setState({initialPosition: lastRegion});
      this.setState({markedPosition: lastRegion});

    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  public render(): React.ReactNode {
    return (
      <MapView
      style={{flex: 1}}
      region={this.state.initialPosition}
      showsUserLocation={true}
      />
    );
  }
}
