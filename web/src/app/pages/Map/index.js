// Utils
import _ from 'lodash';
import moment from 'moment';
import { dayMs, weekMs, monthMs } from 'utils/dates';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Map from 'components/Map';
import MachineMarker from 'components/MachineMarker';
import StatusPanel from './statusPanel';
import Brands from 'components/Brands';
import EquipmentTrackingMap from 'components/EquipmentTrackingMap';
// Services
import { database } from 'services/firebase';
import configStorage, { CONFIG_KEYS } from 'services/configStorage';
import { getTrackingsForGroups } from 'services/api';
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

// SnowRemovingMap
class SnowRemovingMap extends Component{
  constructor(props){
    super(props);
    const savedItems = configStorage.get(CONFIG_KEYS.ITEMS);
    const savedTrackingAnalytics = configStorage.get(CONFIG_KEYS.TRACKING_ANALYTICS);
    this.state = {
      items: savedItems || [],
      showInfoForItem: null,
      modified: Date.now(),
      trackingPoints: null,
      trackingAnalytics: savedTrackingAnalytics || null,
    }
  }

  // Lifecycle

  componentWillMount(){
    // Init getting items
    this.itemsHandler = database.ref('items/data').on('value', (snapshot) => {
      log('new items');
      const valObj = snapshot.val();
      const items = _.map(valObj, (data, id) => ({id, ...data}));
      configStorage.set(CONFIG_KEYS.ITEMS, items);
      this.setState({items});
    });
    // Init analytics
    this.showTrackingAnalytics(this.state.trackingAnalytics);    
  }

  componentDidMount(){
    
  }

  componentWillUnmount(){
    if(this.itemsHandler){
      this.itemsHandler();
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  componentDidCatch(err){
    log.err(err);
  }

  // Functionality

  showTrackingAnalytics(conf){
    log(`show tracking analytics with conf: ${JSON.stringify(conf)}`);
    this.setState({trackingPoints: null});
    if(!conf || !conf.groups || !conf.groups.length){
      return;
    }
    const { period, groups } = conf;
    // Getting start and end
    let start = conf.start;
    let end = conf.end;
    if(period === 'day'){
      const nowTs = Date.now();
      start = nowTs - dayMs;
      end = nowTs;
    }else if(period === 'week'){
      const nowTs = Date.now();
      start = nowTs - weekMs;
      end = nowTs;
    }
    // Getting point
    getTrackingsForGroups({start, end, groups}).then((data) => {
      const trackingPoints = _.flatten(data);
      this.setState({trackingPoints});
    }).catch((err) => {
      log.err(err);
    });
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

  onStatusPanelItemClick = (e, {id, lat, lng}) => {
    e.stopPropagation();
    this.map.panTo(new google.maps.LatLng({lat, lng}));
    setTimeout(() => {
      this.setState({showInfoForItem: id});
    }, 300);
  }

  onTrackingAnalyticsChange = (trackingAnalytics) => {
    configStorage.set(CONFIG_KEYS.TRACKING_ANALYTICS, trackingAnalytics);
    this.setState({trackingAnalytics});
    this.showTrackingAnalytics(trackingAnalytics);
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
      trackingPoints,
      trackingAnalytics,
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
          { trackingPoints ? (
            <EquipmentTrackingMap data={trackingPoints} />
          ) : null }
        </Map>
        <StatusPanel 
          style={styles.status} 
          items={items}
          trackingAnalytics={trackingAnalytics}
          onItemClick={this.onStatusPanelItemClick}
          onTrackingAnalyticsChange={this.onTrackingAnalyticsChange}
        />
        <Brands style={styles.brandsWrap} />
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
    width: 260,
    zIndex: 2,
  },
  brandsWrap: {
    position: 'absolute',
    bottom: 6,
    left: 40,
    right: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
}

// Attach prop types
SnowRemovingMap.propTypes = propTypes;
SnowRemovingMap.defaultProps = defaultProps;

export default SnowRemovingMap;
