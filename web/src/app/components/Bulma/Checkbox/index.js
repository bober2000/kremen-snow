// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Prop types
const propTypes = {
  style: PropTypes.any,
  disabled: PropTypes.bool,
  title: PropTypes.string,
};

// Default prop types
const defaultProps = {
  style: null,
  disabled: false,
  title: '',
};

// Checkbox
class Checkbox extends Component{
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
      disabled,
      title,
    } = this.props;
    // Render
    return (
      <label 
        className="checkbox"
        style={style}
        disabled={disabled}
      >
        <input type="checkbox" />
        { title }
      </label>
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
