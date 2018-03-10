// Utils
import moment from 'moment';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toggle, DatePicker } from 'components/UI';
import { Checkbox, Radio } from 'components/Bulma';
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

// AnalyticsPanel
class AnalyticsPanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      visible: false,
      start: moment(),
      end: moment(),
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

  componentDidCatch(err, info){
    console.error(err);
  }

  // Events

  onVisibleChange = (visible) => {
    this.setState({visible});
  }

  // Render

  render(){
    // Props
    const { 
      style,
    } = this.props;
    // State
    const {
      visible,
      start,
      end,
    } = this.state;
    // Render
    return (
      <div style={m(styles.container, style)}> 
        <div style={m(styles.row, styles.bottomLine, styles.rowFirst)}>
          <div><strong>Карта очистки: </strong></div>
          <div>
            <Toggle 
              value={visible}
              onChange={this.onVisibleChange} 
            />
          </div>
        </div>
        <div style={m(styles.row)}>
          <strong>Техніка:</strong>
        </div>
        <div style={m(styles.row)}>
          <strong>Трактори</strong>
          <Toggle 
            value={visible}
            onChange={this.onVisibleChange} 
          />
        </div>
        <div style={m(styles.row)}>
          <strong>Посипальник</strong>
          <Toggle 
            value={visible}
            onChange={this.onVisibleChange} 
          />
        </div>
        <div style={m(styles.row, styles.bottomLine)}>
          <strong>Снігоприбиральники</strong>
          <Toggle 
            value={visible}
            onChange={this.onVisibleChange} 
          />
        </div>
        <div style={m(styles.row)}>
          <strong>Період:</strong>
        </div>
        <div style={m(styles.row)}>
          <Radio title="День" name="period" />
          <Radio title="Тиждень" name="period" />
          <Radio title="Свій" name="period" />
        </div>
        <div style={m(styles.row)}>
          <div style={m(styles.full, styles.rightIndent)}>
            <div><strong>Початок:</strong></div>
            <DatePicker 
              inputStyle={styles.datePickerInput}
              selected={start}
              dateFormat="DD.MM.YYYY"
            />
          </div>
          <div style={m(styles.full, styles.leftIndent)}>
            <div><strong>Кінець:</strong></div>
            <DatePicker 
              inputStyle={styles.datePickerInput}
              selected={end}
              dateFormat="DD.MM.YYYY"
            />
          </div>
        </div>
      </div>
    );
  }
}

// Style
const styles = {
  container: {

  },
  row: {
    fontSize: '14px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  rowFirst: {
    paddingTop: 0,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  full: {
    flex: 1,
  },
  datePickerInput: {
    width: '100%'
  },
  leftIndent: {
    marginLeft: 3,
  },
  rightIndent: {
    marginRight: 3,
  },
  bottomLine: {
    borderBottom: '1px solid #dbdbdb',
  },
}

// Attach prop types
AnalyticsPanel.propTypes = propTypes;
AnalyticsPanel.defaultProps = defaultProps;

export default AnalyticsPanel;
