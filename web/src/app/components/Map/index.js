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
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4fHuZhj5xqfXC-m10d7T2GgQLkdJQrZE"
      loadingElement={<div style={style} />}
      containerElement={<div style={style} />}
      mapElement={<div style={style} />}
      {...props}
    />
  )
}

export default WrappedMapWithDefault;
