import React from 'react';
import {
  AppRegistry,
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import App from './components/App';

const store = createStore(
  reducer,
  applyMiddleware(thunk),
);

export default function Divvy() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

AppRegistry.registerComponent('Divvy', () => Divvy);
