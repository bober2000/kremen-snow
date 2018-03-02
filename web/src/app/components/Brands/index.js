// Utils
import _ from 'lodash';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Styles
import Radium from 'radium';

// Assets
import iqHubLogo from './iqhub.png';

// PropTypes

const propTypes = {
  style: PropTypes.object,
};

const defaultProps = {
  style: null,
};

// Brands

class Brands extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // Render

  render() {
    // Props
    const {
      style,
    } = this.props;
    // Data
    const items = [
      {icon: iqHubLogo, title: "IQ Hub", link: "https://io.kr.ua/"},
    ];
    // Render
    return (
      <div style={[styles.container, style]}>
        {_.map(items, ({icon, title, link}, index) => (
          <div 
            key={index}
            style={styles.item}
          >
            <a
              href={link}
              target="__blank"
              style={styles.link}
            >
              <img
                src={icon}
                style={styles.img}
                alt={title}
              />
            </a>
          </div>
        ))}
      </div>
    );
  }
}

// Styles

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: { 
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  link: {
    borderBottom: 'none',
    cursor: 'pointer',
  },
  img: {
    width: 100,
  },
};

// Attach prop types

Brands.propTypes = propTypes;
Brands.defaultProps = defaultProps;

export default Radium(Brands);
