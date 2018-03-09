// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Toggle from 'components/UI/Toggle';
import DatePicker from 'react-datepicker';
// Styles
import { mstyle as m } from 'styles';

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// AnalyticsPanel
class AnalyticsPanel extends Component{
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
    } = this.props;
    return (
      <div>В процесі розробки...</div>
    )
    // Render
    return (
      <div style={m(styles.container, style)}> 
        <div style={m(styles.row)}>
          <div><strong>Карта очистки: </strong></div>
          <div><Toggle /></div>
        </div>
        <DatePicker />
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
}

// Attach prop types
AnalyticsPanel.propTypes = propTypes;
AnalyticsPanel.defaultProps = defaultProps;

export default AnalyticsPanel;
