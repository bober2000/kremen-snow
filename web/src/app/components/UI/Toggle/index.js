// React
import React from 'react';
import PropTypes from 'prop-types';
// Components
import ReactToggle from 'react-toggle';

// Prop types
const propTypes = {
  
};

// DefaultProps
const defaultProps = {
  
};

// Toggle
function Toggle(props){
  // Render
  return (
    <ReactToggle
      icons={{checked: null, unchecked: null}} 
      {...props}
    />
  );
}

// Style
const styles = {
  
}

// Attach prop types
Toggle.propTypes = propTypes;
Toggle.defaultProps = defaultProps;

export default Toggle;