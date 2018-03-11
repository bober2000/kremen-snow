// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
// Styles
const rainbowGradient = [
  'rgba(102,255,0,0)', 
  'rgba(147,255,0,1)', 
  'rgba(193,255,0,1)', 
  'rgba(238,255,0,1)', 
  'rgba(244,227,0,1)', 
  'rgba(244,227,0,1)', 
  'rgba(249,198,0,1)', 
  'rgba(255,170,0,1)', 
  'rgba(255,113,0,1)', 
  'rgba(255,57,0,1)', 
  'rgba(255,0,0,1)',
];

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// EquipmentHeatmap
class EquipmentHeatmap extends Component{
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
      data,
    } = this.props;
    if(!data) return null;
    // Data
    const convData = data.map((item) => (
      new google.maps.LatLng(item)
    ));
    // Render
    return (
      <HeatmapLayer 
        data={convData}
        options={{
          radius: 16,
          opacity: 1,
          dissipating: true,
          gradient: rainbowGradient,
        }}
      />
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
EquipmentHeatmap.propTypes = propTypes;
EquipmentHeatmap.defaultProps = defaultProps;

export default EquipmentHeatmap;
