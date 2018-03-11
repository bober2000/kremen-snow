// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// Modal
class Modal extends Component{
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

  onBackgroundClick = (e) => {
    e.preventDefault();
    this.props.onRequestClose();
  }

  onCloseClick = (e) => {
    e.preventDefault();
    this.props.onRequestClose();
  }

  // Render

  render(){
    // Props
    const { 
      style,
      visible,
      children,
    } = this.props;
    // Render
    return (
      <div className={visible ? "modal is-active" : "modal"}>
        <div 
          className="modal-background"
          onClick={this.onBackgroundClick} 
        />
        <div className="modal-content">
          { children }
        </div>
        <button 
          className="modal-close is-large" 
          aria-label="close"
          onClick={this.onCloseClick} 
        />
      </div>
    );
  }
}

// Style
const styles = {
  
}

// Attach prop types
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
