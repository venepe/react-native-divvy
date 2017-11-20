import DivvyTypes from '../constants/DivvyTypes';

const initialState = {
  stations: [],
  userCoordinates: {
    latitude: null,
    longitude: null,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DivvyTypes.REQUEST_STATIONS:
      return {
        ...state,
        ...action.payload,
        isLoading: true,
      };
    case DivvyTypes.RECEIVE_STATIONS:
      return {
        ...state,
        ...action.payload,
        stations: [
          ...state.stations,
          ...action.payload.stations,
        ],
        isLoading: false,
      };
    case DivvyTypes.LOCATION_CHANGED:
      return {
        ...state,
        userCoordinates: {
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export const getStations = state => state.stations;

export default reducer;
