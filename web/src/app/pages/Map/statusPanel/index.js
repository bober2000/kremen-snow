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
// Services
import configStorage, { CONFIG_KEYS } from 'services/configStorage';
// Fiebase
import { database } from 'services/firebase';
// Styles
import { mstyle as m, colors } from 'styles';
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
    const initTab = configStorage.get(CONFIG_KEYS.STATUS_PANEL_TAB) || null; 
    this.state = {
      modified: Date.now(),
      initTab,
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

  // Events

  onTabChange = (tabId) => {
    log(`tab changed - ${tabId}`);
    configStorage.set(CONFIG_KEYS.STATUS_PANEL_TAB, tabId);
  }

  // Render

  render(){
    // Props
    const { 
      style,
      items,
      trackingAnalytics,
      trackingAnalyticsProcessing,
      onItemClick,
      onTrackingAnalyticsChange,
      onAboutClick,
    } = this.props;
    // State
    const {
      modified,
      initTab,
    } = this.state;
    // Render
    return (
      <Box style={m(styles.container, style)}>
        <Tabs 
          color={colors.mainColor}
          initTab={initTab}
          tabs={[
            { id: 'status', title: 'Статус', content: (
              <StatePanel 
                modified={modified}
                items={items}
                onItemClick={onItemClick}
              />
            )},
            { id: 'analytics', title: 'Аталітика', content: (
              <AnalyticsPanel 
                data={trackingAnalytics}
                processing={trackingAnalyticsProcessing}
                onChange={onTrackingAnalyticsChange}
              />
            )}
          ]}
          onTabChange={this.onTabChange}
        />
        <div style={styles.aboutWrap}>
          <a onClick={onAboutClick}>Про проект</a>
        </div>
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
  },
  aboutWrap: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
}

// Attach prop types
MapStatusPanel.propTypes = propTypes;
MapStatusPanel.defaultProps = defaultProps;

export default MapStatusPanel;
