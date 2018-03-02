// React
import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
// Pages
import MapPage from './pages/Map';
// Styles
import './app.scss';
import '../../node_modules/font-awesome/css/font-awesome.css';
import { mixings } from 'styles';
// Log
// const log = require('utils/log').withModule('app');

// Init Log
// const logEnabled = ConfigStorage.get('log') || ((typeof ENV !== 'undefined') && (ENV === 'dev'));
// if (logEnabled) {
//   log.enabled(true);
// } else {
//   log.enabled(false);
// }

// AppContainer
const AppContainer = () => {
  return (
    <MapPage 
      style={mixings.fullScreen} 
    />
  );
}

// Render

injectTapEventPlugin();

ReactDOM.render((<AppContainer />), document.getElementById('app'));
