// Utils
import _ from 'lodash';
import moment from 'moment';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Map from 'components/Map';
import MachineMarker from 'components/MachineMarker';
import StatusPanel from './statusPanel';
import Brands from 'components/Brands';
// Services
import { database } from 'services/firebase';
import configStorage, { CONFIG_KEYS } from 'services/configStorage';
// Consts
import { coordinates } from 'consts';
// Style
import { mstyle as m } from 'styles';
// Log
const log = require('utils/log').default.withModule('mapPage');

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// Helpers

const getDefaultZoom = () => (
  configStorage.get(CONFIG_KEYS.MAP_ZOOM) || 14
);

const getDefaultCoord = () => (
  configStorage.get(CONFIG_KEYS.MAP_CENTER) || coordinates.kremen
);

// Firebase

const itemsRef = database.ref('items/data');

// SnowRemovingMap
class SnowRemovingMap extends Component{
  constructor(props){
    super(props);
    const savedItems = configStorage.get(CONFIG_KEYS.ITEMS);
    this.state = {
      items: savedItems || [],
      showInfoForItem: null,
      modified: Date.now(),
    }
  }

  // Lifecycle

  componentWillMount(){
    this.itemsHandler = itemsRef.on('value', (snapshot) => {
      log('new items');
      const valObj = snapshot.val();
      const items = _.map(valObj, (data, id) => ({id, ...data}));
      configStorage.set(CONFIG_KEYS.ITEMS, items);
      this.setState({items});
    });
  }

  componentDidMount(){
    
  }

  componentWillUnmount(){
    
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  componentDidCatch(err){
    log.err(err);
  }

  // Events

  onMapRef = (map) => {
    if(this.map || !map) return;
    this.map = map;
  }

  onMapZoomChanged = () => {
    const zoom = this.map.getZoom();
    log(`zoom changed: ${zoom}`);
    configStorage.set(CONFIG_KEYS.MAP_ZOOM, zoom);
  }

  onMapCenterChanged = () => {
    const coord = this.map.getCenter();
    const center = {lat: coord.lat(), lng: coord.lng()};
    configStorage.set(CONFIG_KEYS.MAP_CENTER, center);
  }
  
  onMapClick = () => {
    log('map click');
    this.setState({showInfoForItem: null});
  }

  onMarkerClick = (item) => {
    this.setState({showInfoForItem: item.id});
  }

  onMarkerInfoCloseClick = (item) => {
    this.setState({showInfoForItem: null});
  }

  // Render

  render(){
    // Props
    const { 
      style,
    } = this.props;
    // State
    const {
      items,
      showInfoForItem,
      modified,
    } = this.state;
    // Render
    return (
      <div style={m(styles.container, style)}>
        <Map 
          mapRef={this.onMapRef}
          style={styles.map}
          defaultZoom={getDefaultZoom()}
          defaultCenter={getDefaultCoord()} 
          options={{
            fullscreenControl: false,
            mapTypeControlOptions: { 
              mapTypeIds: ['HYBRID', 'SATELLITE'],
              position: 'TOP_RIGHT',
              style: 'DEFAULT',
            }
          }}
          onZoomChanged={this.onMapZoomChanged}
          onCenterChanged={this.onMapCenterChanged}
          onClick={this.onMapClick}
        >
          {_.map(items, (item) => (
            <MachineMarker 
              key={item.id}
              item={item}
              infoOpen={showInfoForItem === item.id}
              onClick={() => this.onMarkerClick(item)}
              onInfoCloseClick={() => this.onMarkerInfoCloseClick(item)}
            />
          ))}
        </Map>
        <StatusPanel style={styles.status} />
        <div style={styles.brandsWrap}>
          <Brands style={styles.status} />
        </div>
      </div>
    );
  }
}

// Style
const styles = {
  container: {
    
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  status: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 200,
    zIndex: 2,
  },
  brandsWrap: {
    position: 'absolute',
    bottom: 14,
    left: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 2,
  },
}

// Attach prop types
SnowRemovingMap.propTypes = propTypes;
SnowRemovingMap.defaultProps = defaultProps;

export default SnowRemovingMap;
