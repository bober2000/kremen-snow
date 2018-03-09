// Utils
import moment from 'moment';
import { minMs } from 'utils/dates';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Box from 'components/Bulma/Box';
import Tabs from 'components/Bulma/Tabs';
import StatePanel from './statePanel';
import AnalyticsPanel from './analyticsPanel';
// Fiebase
import { database } from 'services/firebase';
// Styles
import { mstyle as m } from 'styles';
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
    if(this.modifiedHandler){
      this.modifiedHandler();
      this.modifiedHandler = null;
    }
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
      items,
      onItemClick,
    } = this.props;
    // State
    const {
      modified,
    } = this.state;
    // Render
    return (
      <Box style={m(styles.container, style)}>
        <Tabs tabs={[
          { id: 'status', title: 'Статус', content: (
            <StatePanel 
              modified={modified}
              items={items}
              onItemClick={onItemClick}
            />
          )},
          { id: 'analytics', title: 'Аталітика', content: (
            <AnalyticsPanel />
          )}
        ]}/>
      </Box>
    );
  }
}

// Style
const styles = {
  container: {
    backgroundColor: 'rgba(255, 255, 255, .7)',
  },
  row: {
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activeWrap: {
    marginTop: 10,
  }
}

// Attach prop types
MapStatusPanel.propTypes = propTypes;
MapStatusPanel.defaultProps = defaultProps;

export default MapStatusPanel;
