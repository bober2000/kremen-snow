// React
import React from 'react';
// Components
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';
// Log
const log = require('utils/log').default.withModule('map');

const Map = ({mapRef, ...props}) => {
  return (
    <GoogleMap ref={mapRef}  {...props}/>
  )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

const WrappedMapWithDefault = ({style, ...props}) => {
  const prodApiKey = 'AIzaSyAP4g1h94vC8DUOMFfPYOQLpTAvzqB0gOY';
  const apiKey = typeof MAPS_API_KEY !== 'undefined' && MAPS_API_KEY ? MAPS_API_KEY : prodApiKey;
  log(`key = ${apiKey}`);
  return (
    <WrappedMap 
      googleMapURL={`https://maps.googleapis.com/maps/api/js?libraries=visualization&key=${apiKey}`}
      loadingElement={<div style={style} />}
      containerElement={<div style={style} />}
      mapElement={<div style={style} />}
      {...props}
    />
  )
}

export default WrappedMapWithDefault;
