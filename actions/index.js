/* global fetch navigator */
import DivvyTypes from '../constants/DivvyTypes';
import config from '../config';

let watchId;

export const startWatch = () =>
  (dispatch) => {
    watchId = navigator.geolocation.watchPosition(
      position => dispatch(userLocationChanged({ payload: position.coords })),
      error => console.error(error),
      {
        enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10,
      },
    );
  };

export const clearWatch = () =>
  () => {
    navigator.geolocation.clearWatch(watchId);
  };

export const userLocationChanged = payload => ({
  type: DivvyTypes.USER_LOCATION_CHANGED,
  ...payload,
});

export const requestStations = payload => ({
  type: DivvyTypes.REQUEST_STATIONS,
  ...payload,
});

export const receiveStations = payload => ({
  type: DivvyTypes.RECEIVE_STATIONS,
  ...payload,
});

export const fetchStations = () =>
  (dispatch) => {
    dispatch(requestStations());

    return fetch(config.DIVVY_API_URL)
      .then(response => response.json())
      .then(responseJson => responseJson.stationBeanList)
      .then(stations => dispatch(receiveStations({ payload: { stations } })))
      .catch(error => console.error(error));
  };

const actions = {
  requestStations,
};

export default actions;
