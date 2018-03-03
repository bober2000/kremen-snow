// Utils
import moment from 'moment';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import { Marker, InfoWindow } from 'react-google-maps';
// Icons
const tractorActiveIcon = require('assets/img/icon-pin-tractor-active.svg');
const snowPlowActiveIcon = require('assets/img/icon-pin-snow-plow-active.svg');
const dumpTruckActiveIcon = require('assets/img/icon-pin-dump-truck-active.svg');

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// Helpers

const itemToIcon = (item) => {
  if(!item) return null;
  const group = item.group ? item.group.toLowerCase() : null;
  if(group){
    if(group === 'трактори'){
      return tractorActiveIcon;
    }
    if(group === 'снігоприбиральники'){
      return snowPlowActiveIcon;
    }
    if(group === 'посипальники'){
      return dumpTruckActiveIcon;
    }
  }
  return null;
}

const tsToTimeStr = (ts) => {
  return moment(ts).format('HH:mm:ss');
}

const itemToPhoto = (item) => {
  if(!item || !item.name) return null;
  const name = item.name.toLowerCase();
  if(name.indexOf('юмз-6') >= 0){
    return '/assets/img/photo-umz-6.jpg';
  }
  if(name.indexOf('foton-504') >= 0){
    return '/assets/img/photo-foton-504.jpg';
  }
  if(name.indexOf('краз') >= 0){
    return '/assets/img/photo-kraz.jpg';
  }
  if(name.indexOf('борекс') >= 0){
    return '/assets/img/photo-borex.jpg';
  }
  if(name.indexOf('маз') >= 0){
    return '/assets/img/photo-maz.jpg';
  }
  if(name.indexOf('jcb') >= 0){
    return '/assets/img/photo-jcb.jpg';
  }
  if(name.indexOf('bobcat') >= 0){
    return '/assets/img/photo-bobcat.jpg';
  }
  return null;
}

// MachineMarker
class MachineMarker extends Component{
  constructor(props){
    super(props);
  }

  // Lifecycle

  componentWillMount(){

  }

  componentDidMount(){
    
  }

  componentWillUnmount(){
    
  }

  shouldComponentUpdate(nextProps, nextState){
    return true;
  }

  componentDidCatch(err, info){
    console.error(err);
  }

  // Render

  render(){
    // Props
    const { 
      style,
      item,
      infoOpen,
      onClick,
      onInfoCloseClick,
    } = this.props;
    // Data
    const { lat, lng, name, group, company, speed, modified } = item;
    const photo = itemToPhoto(item);
    // Render
    return (
      <Marker
        position={{ lat, lng }}
        defaultTitle={ item.name }
        icon={ itemToIcon(item) }
        onClick={onClick}
      >
        {infoOpen ? (
          <InfoWindow onCloseClick={onInfoCloseClick}>
            <div>
              <div><strong>{ name }</strong></div>
              { group ? (
                <div>
                  <strong>Тип: </strong>
                  <span>{ group.toLowerCase() }</span>
                </div>
              ) : null }
              { company ? (
                <div>
                  <strong>Компанія: </strong>
                  <span>{ company }</span>
                </div>
              ) : null }
              { speed ? (
                <div>
                  <strong>Швидкість: </strong>
                  <span>{ speed }</span>
                </div>
              ) : null }
              { modified ? (
                <div>
                  <strong>Оновлено: </strong>
                  <span>{ tsToTimeStr(modified) }</span>
                </div>
              ) : null }
              { photo ? (
                <div style={styles.photoWrap}>
                  <img 
                    style={styles.photo}
                    src={photo} 
                  />
                </div>
              ) : null }
            </div>
          </InfoWindow>
        ) : null}
      </Marker>
    );
  }
}

// Style
const styles = {
  photoWrap: {
    marginTop: 10,
    textAlign: 'center',
  },
  photo: {
    maxWidth: '200px',
    maxHeight: '100px',
  },
}

// Attach prop types
MachineMarker.propTypes = propTypes;
MachineMarker.defaultProps = defaultProps;

export default MachineMarker;
