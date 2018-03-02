// Utils
import _ from 'lodash';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Map from 'components/Map';
import MacineMarker from './machineMarker';
// Services
import { database } from 'services/firebase';
// Consts
import { coordinates } from 'consts';
// Style
import { mstyle as m } from 'styles';

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// Firebase
const itemsRef = database.ref('snowRemoving/items');

// SnowRemovingMap
class SnowRemovingMap extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }

  // Lifecycle

  componentWillMount(){
    this.itemsHandler = itemsRef.on('value', (snapshot) => {
      const valObj = snapshot.val();
      const items = _.map(valObj, (data, id) => ({id, ...data}));
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

  componentDidCatch(err, info){
    console.error(err);
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
    } = this.state;
    // Render
    return (
      <Map 
        style={m(styles.container, style)}
        defaultZoom={14}
        defaultCenter={coordinates.kremen} 
      >
        {_.map(items, (item) => (
          <MacineMarker 
            key={item.id}
            item={item}
          />
        ))}
      </Map>
    );
  }
}

// Style
const styles = {
  container: {

  },
}

// Attach prop types
SnowRemovingMap.propTypes = propTypes;
SnowRemovingMap.defaultProps = defaultProps;

export default SnowRemovingMap;
