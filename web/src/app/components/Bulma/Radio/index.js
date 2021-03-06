// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Prop types
const propTypes = {
  style: PropTypes.any,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

// Default prop types
const defaultProps = {
  style: null,
  checked: false,
  onChange: () => {},
};

// Radio
class Radio extends Component{
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
      title,
      name,
      value,
      checked,
      onChange,
    } = this.props;
    // Render
    return (
      <label className="radio" style={style}>
        <input 
          type="radio" 
          name={name} 
          value={value} 
          checked={checked}
          onChange={onChange}
        />
        {` ${title}`}
      </label>
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
Radio.propTypes = propTypes;
Radio.defaultProps = defaultProps;

export default Radio;
