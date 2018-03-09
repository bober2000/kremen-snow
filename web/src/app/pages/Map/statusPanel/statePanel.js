// Utils
import moment from 'moment';
import { minMs } from 'utils/dates';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Consts
const activeItemTimeout = minMs * 10;
// Styles
import { mstyle as m } from 'styles';
// Log
const log = require('utils/log').default.withModule('itemsState');

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// MapItemsState
class MapItemsState extends Component{
  constructor(props){
    super(props);
    this.state = {};
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
      items,
      modified,
      onItemClick,
    } = this.props;
    // Data
    const nowTs = Date.now();
    const activeItems = items.filter(({modified}) => {
      return modified > (nowTs - activeItemTimeout);
    });
    // Render
    return (
      <div style={m(styles.container, style)}>
        <div style={m(styles.row)}>
          <div><strong>Активнох техніки: </strong></div>
          <div>{ activeItems.length }</div>
        </div>
        <div style={m(styles.row)}>
          <div><strong>Всього техніки: </strong></div>
          <div>{ items.length }</div>
        </div>
        <div style={m(styles.row)}>
          <div><strong>Оновлено: </strong></div>
          <div>{ moment(modified).format('HH:mm:ss') }</div>
        </div>
        {activeItems.length ? (
          <div style={styles.activeWrap}>
            {activeItems.map((item, index) => (
              <div key={item.id} style={m(styles.row, styles.activeItem)}>
                <div><a onClick={(e) => onItemClick(e, item)}><strong>{ item.name }</strong></a></div>
                <div>{ item.speed }</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
}

// Style
const styles = {
  container: {
    
  },
  row: {
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeWrap: {
    marginTop: 10,
  },
  activeItem: {
    fontSize: '12px',
  },
}

// Attach prop types
MapItemsState.propTypes = propTypes;
MapItemsState.defaultProps = defaultProps;

export default MapItemsState;
