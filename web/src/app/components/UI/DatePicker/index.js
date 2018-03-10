// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import ReactDatePicker from 'react-datepicker';
// Style
import { mstyle as m } from 'styles';

// Prop types
const propTypes = {
  
};

// DefaultProps
const defaultProps = {
  
};

class CustomInput extends Component{

  // Events
  onChange = () => {

  }

  // Render
  render(){
    const { 
      style,
      value,
      onClick
    } = this.props;
    return (
      <input
        style={m(styles.input, style)}
        type="text"
        className="input"
        value={value}
        onClick={onClick}
        onChange={this.onChange}
      />
    );
  }
}

// DatePicker
function DatePicker(rawProps){
  // Props
  const {
    inputStyle, 
    ...props
  } = rawProps;
  // Render
  return (
    <ReactDatePicker 
      {...props} 
      customInput={<CustomInput style={inputStyle} />}
    />
  );
}

// Style
const styles = {
  input: {
    width: '100%',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '4px',
    paddingRight: '4px',
    height: '24px',
    lineHeight: '24px',
    fontSize: '14px',
  },
}

// Attach prop types
DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;