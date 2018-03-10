/**
 * Toggle UI
 * 
 * Source: https://codepen.io/mallendeo/pen/eLIiG
 */

// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Styles
import { mstyle as m } from 'styles';
import './index.scss';

// Prop types
const propTypes = {
  theme: PropTypes.oneOf(['light', 'ios', 'skewed', 'flat', 'flip']),
  onChange: PropTypes.func,
};

// DefaultProps
const defaultProps = {
  style: null,
  theme: 'flat',
  value: false,
  onChange: () => {},
};

// CustomToggle
class CustomToggle extends Component{
  constructor(props){
    super(props);
    this.elementId = props.id || Math.random().toString(36).slice(-10);
  }

  // Events

  onChange = (e) => {
    e.stopPropagation();
    const { target } = e;
    const value = target.checked;
    this.props.onChange(value);
  }

  // Render
  render(){
    // Props
    const {
      style,
      theme,
      value,
    } = this.props;
    // Render
    return (
      <div style={m(styles.container, style)}>
        <input 
          className={`tgl tgl-${theme}`} 
          id={this.elementId} 
          checked={value}
          type="checkbox"
          onChange={this.onChange}
        />
        <label 
          className="tgl-btn" 
          htmlFor={this.elementId} 
        />
      </div>
    );
  }
}

// Style
const styles = {
  container: {

  },
}

// Attach prop types
CustomToggle.propTypes = propTypes;
CustomToggle.defaultProps = defaultProps;

export default CustomToggle;