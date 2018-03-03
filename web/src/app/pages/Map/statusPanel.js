// Utils
import moment from 'moment';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Box from 'components/Box';
// Fiebase
import { database } from 'services/firebase';
// Log
const log = require('utils/log').default.withModule('statusPanel');

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// MapStatusPanel
class MapStatusPanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      modified: Date.now(),
    }
  }

  // Lifecycle

  componentWillMount(){
    this.modifiedHandler = database.ref('items/modified').on('value', (snapshot) => {
      const modified = Number.parseInt(snapshot.val(), 10);
      if(modified){
        this.setState({modified});
      }else{
        log.err('modified data empty');
      }
    })
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
      modified,
    } = this.state;
    // Render
    return (
      <Box style={style}>
        <div>
          <strong>Оновлено: </strong>
          <span>{ moment(modified).format('HH:mm:ss') }</span>
        </div>
      </Box>
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
MapStatusPanel.propTypes = propTypes;
MapStatusPanel.defaultProps = defaultProps;

export default MapStatusPanel;
