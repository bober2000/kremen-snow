// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import { Marker } from "react-google-maps";
// Assets
const tractorActiveIcon = require('./icon-tractor-active.svg');
const snowPlowActiveIcon = require('./icon-snow-plow-active.svg');
const dumpTruckActiveIcon = require('./icon-dump-truck-active.svg');

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

// MacineMarker
class MacineMarker extends Component{
  constructor(props){
    super(props);
    this.state = {}
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
    } = this.props;
    // Data
    const {
      lat,
      lng,
    } = item;
    // Render
    return (
      <Marker
        position={{ lat, lng }}
        defaultTitle={ item.name }
        icon={ itemToIcon(item) }
      />
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
MacineMarker.propTypes = propTypes;
MacineMarker.defaultProps = defaultProps;

export default MacineMarker;
