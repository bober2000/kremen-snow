// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Styles
import { mstyle as m } from 'styles';

// Prop types
const propTypes = {
  style: PropTypes.any,
  initTab: PropTypes.string,
  onTabChange: PropTypes.func,
};

// Default prop types
const defaultProps = {
  style: null,
  initTab: null,
  onTabChange: () => {},
};

// Tabs
class Tabs extends Component{
  constructor(props){
    super(props);
    const initTabId = props.initTab; 
    const firstTabId = props.tabs && props.tabs.length ? props.tabs[0].id : null;
    const active = initTabId || firstTabId;
    this.state = {
      active,
    };
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
    this.props.onTabChange(id);
  }

  // Render

  render(){
    // Props
    const { 
      style,
      tabs,
      color = '#3273dc',
    } = this.props;
    // State
    const {
      active,
    } = this.state;
    // Styles
    const styles = getStyles({mainColor: color});
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
                  style={m(styles.tab, (id === active ) ? styles.tabActive : null)}
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
const getStyles = ({mainColor}) => ({
  container: {

  },
  tabs: {

  },
  tab: {
    padding: '0.2em 0.7em',
    fontSize: '14px',
    fontWeight: 'bold',
    color: mainColor,
  },
  tabActive: {
    borderBottomColor: mainColor,
  },
  content: {
    
  },
});

// Attach prop types
Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;

export default Tabs;
