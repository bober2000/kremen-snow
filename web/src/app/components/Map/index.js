// React
import React from 'react';
// Components
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

const Map = ({mapRef, ...props}) => {
  return (
    <GoogleMap ref={mapRef}  {...props}/>
  )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

const WrappedMapWithDefault = ({style, ...props}) => {
  return (
    <WrappedMap 
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAP4g1h94vC8DUOMFfPYOQLpTAvzqB0gOY"
      loadingElement={<div style={style} />}
      containerElement={<div style={style} />}
      mapElement={<div style={style} />}
      {...props}
    />
  )
}

export default WrappedMapWithDefault;
