import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { getStations } from '../../reducers';
import { fetchStations, startWatch, clearWatch } from '../../actions';
import mapPin100 from '../../assets/map-pin-100.png';
import mapPin90 from '../../assets/map-pin-90.png';
import mapPin80 from '../../assets/map-pin-80.png';
import mapPin60 from '../../assets/map-pin-60.png';
import mapPin40 from '../../assets/map-pin-40.png';
import mapPin20 from '../../assets/map-pin-20.png';
import mapPin10 from '../../assets/map-pin-10.png';
import mapPin0 from '../../assets/map-pin-0.png';
import styles from './styles';

class Home extends Component {
  static propTypes = {
    fetchStations: PropTypes.func.isRequired,
    startWatch: PropTypes.func.isRequired,
    clearWatch: PropTypes.func.isRequired,
    region: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      latitudeDelta: PropTypes.number.isRequired,
      longitudeDelta: PropTypes.number.isRequired,
    }),
    userCoordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
    stations: PropTypes.arrayOf(PropTypes.shape({
      availableBikes: PropTypes.number.isRequired,
      availableDocks: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      stationName: PropTypes.string.isRequired,
      totalDocks: PropTypes.number.isRequired,
    })),
  }

  static defaultProps = {
    stations: [],
    region: {
      latitude: 41.881832,
      longitude: -87.623177,
      latitudeDelta: 0.0122,
      longitudeDelta: 0.0061,
    },
    userCoordinates: {
      latitude: 41.8781,
      longitude: -87.6298,
    },
  }

  static navigationOptions = {
    title: 'Divvy',
    headerStyle: {
      backgroundColor: '#3B5998',
    },
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    headerBackTitle: 'Back',
  };

  static getPin(availableBikes, totalDocks) {
    // TODO: Better search algo
    const val = availableBikes / totalDocks;
    if (val === 1) {
      return mapPin100;
    } else if (val >= 0.9) {
      return mapPin90;
    } else if (val >= 0.8) {
      return mapPin80;
    } else if (val >= 0.6) {
      return mapPin60;
    } else if (val >= 0.4) {
      return mapPin40;
    } else if (val > 0.2) {
      return mapPin20;
    } else if (val > 0) {
      return mapPin10;
    }
    return mapPin0;
  }

  constructor(props) {
    super(props);

    this.onRegionChange = this.onRegionChange.bind(this);

    this.state = {
      stations: props.stations,
      region: props.region,
      userCoordinates: props.userCoordinates,
    };
  }

  componentDidMount() {
    this.props.fetchStations()
      .catch(() => {
        console.error('Failed');
      });

    this.props.startWatch();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stations) {
      this.setState({
        stations: nextProps.stations,
      });
    }

    if (nextProps.userCoordinates) {
      this.setState({
        userCoordinates: nextProps.userCoordinates,
      });
    }
  }

  componentWillUnmount() {
    this.props.clearWatch();
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  render() {
    const { region, stations } = this.state;
    const bbIX = region.latitude - region.latitudeDelta;
    const bbAX = region.latitude + region.latitudeDelta;
    const bbIY = region.longitude - region.longitudeDelta;
    const bbAY = region.longitude + region.longitudeDelta;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChange={this.onRegionChange}
        >
          {stations.map((station) => {
            const {
              latitude, longitude, stationName,
              availableBikes, availableDocks, totalDocks,
            } = station;

            if (bbIX <= latitude && latitude <= bbAX && bbIY <= longitude && longitude <= bbAY) {
              return (
                <MapView.Marker
                  key={stationName}
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  title={stationName}
                  image={Home.getPin(availableBikes, totalDocks)}
                  description={`Bikes: ${availableBikes} Docks: ${availableDocks}`}
                />
            );
          }
            return null;
        })}
          <MapView.Marker
            key={-1}
            coordinate={this.state.userCoordinates}
            image={mapPin100}
          />
        </MapView>
      </View>
    );
  }
}

Home.navigationOptions = () =>
  ({
    title: 'Home',
    headerStyle: {
      backgroundColor: '#0086C3',
    },
    headerTitleStyle: {
      color: '#FFFFFF',
    },
    headerBackTitle: 'Back',
    headerBackTitleStyle: {
      color: '#FFFFFF',
    },
  });

const mapStateToProps = state => ({
  stations: getStations(state),
});

export default connect(
  mapStateToProps,
  { fetchStations, startWatch, clearWatch },
)(Home);
