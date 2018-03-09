// React
import React from 'react';
import PropTypes from 'prop-types';

// Prop types
const propTypes = {
  
};

// DefaultProps
const defaultProps = {
  
};

// Box
function Box({
  style = null,
  children
}){
  // Render
  return (
    <div className="box" style={style}>
      { children }
    </div>
  );
}

// Style
const styles = {
  
}

// Attach prop types
Box.propTypes = propTypes;
Box.defaultProps = defaultProps;

export default Box;