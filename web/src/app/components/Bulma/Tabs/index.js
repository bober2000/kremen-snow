// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

// Tabs
class Tabs extends Component{
  constructor(props){
    super(props);
    this.state = {
      active: props.tabs && props.tabs.length ? props.tabs[0].id : null,
    }
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

  componentDidCatch(err){
    console.error(err);
  }

  // Events

  onTabClick = (e, id) => {
    e.preventDefault();
    this.setState({active: id});
  }

  // Render

  render(){
    // Props
    const { 
      style,
      tabs,
    } = this.props;
    // State
    const {
      active,
    } = this.state;
    // Render
    return (
      <div style={m(styles.container, style)}>
        <div
          className="tabs" 
          style={m(styles.tabs)}
        >
          <ul>
            {tabs.map(({id, title}) => (
              <li 
                key={id} 
                className={id === active ? 'is-active' : null}
              >
                <a 
                  style={styles.tab}
                  onClick={(e) => this.onTabClick(e, id)}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {tabs.map(({id, content}) => (
          (id === active) ? (
            <div key={id} style={styles.content}>
              { content }
            </div>
          ) : null
        ))}
      </div>
    );
  }
}

// Style
const styles = {
  container: {

  },
  tabs: {

  },
  tab: {
    padding: '0.2em 0.7em',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  content: {
    
  },
}

// Attach prop types
Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
