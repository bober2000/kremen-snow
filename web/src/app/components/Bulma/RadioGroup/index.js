// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Components
import Radio from '../Radio';

// Prop types
const propTypes = {
  style: PropTypes.any,
  name: PropTypes.string.isRequired,
  items: PropTypes.array,
};

// Default prop types
const defaultProps = {
  style: null,
  items: [],
};

// RadioGroup
class RadioGroup extends Component{
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

  // Events

  onRadioChange = (e) => {
    const value = e.target.value;
    this.props.onChange(value);
  }

  // Render

  render(){
    // Props
    const { 
      style,
      name,
      items,
    } = this.props;
    const groupValue = this.props.value;
    // Render
    return (
      <div style={style}> 
        {items.map(({title, value}, index) => (
          <Radio 
            key={index} 
            name={name}
            title={title}
            value={value}
            checked={groupValue === value}
            onChange={this.onRadioChange}
          />
        ))}
      </div>
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
RadioGroup.propTypes = propTypes;
RadioGroup.defaultProps = defaultProps;

export default RadioGroup;
