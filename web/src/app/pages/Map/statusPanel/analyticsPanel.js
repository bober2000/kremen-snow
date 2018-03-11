// Utils
import moment from 'moment';
import _ from 'lodash';
import { dayMs, weekMs } from 'utils/dates';
// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toggle, DatePicker } from 'components/UI';
import { Checkbox, RadioGroup } from 'components/Bulma';
// Styles
import { mstyle as m } from 'styles';
// Log
const log = require('utils/log').default.withModule('analyticsPanel');

// Prop types
const propTypes = {
  style: PropTypes.any,
};

// Default prop types
const defaultProps = {
  style: null,
};

// Helpers

const tsToStr = (ts, format) => (
  moment(ts).format(format)
);

// AnalyticsPanel
class AnalyticsPanel extends Component{
  constructor(props){
    super(props);
    this.state = {
      period: 'day',
      start: moment(),
      end: moment(),
      groups: [],
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

  onActiveChange = (active) => {
    log(`active changed - ${active}`);
    const { onChange } = this.props;
    if(active){
      const groups = ['tracktors', 'trucks' , 'snowremovers'];
      onChange({period: 'day', groups, start: null, end: null});
    }else{
      onChange(null);
    }
  }

  onPeriodChange = (period) => {
    log(`period changed - ${period}`);
    const { data, onChange } = this.props;
    if(period === 'custom'){
      const start = moment().subtract(1, 'day').startOf('day').toDate().getTime();
      const end = moment().endOf('day').toDate().getTime();
      onChange({...data, period, start, end});
    }else{
      onChange({...data, period, start: null, end: null});
    }
  }

  onGorupChange = (name, val) => {
    const { data, onChange } = this.props;
    const oldGroups = data.groups;
    let groups = null;
    if(val){
      groups = _.uniq([name, ...oldGroups]);
    }else{
      groups = _.uniq(oldGroups.filter((item) => (item !== name)));
    }
    onChange({...data, groups});
  }

  onStartChange = (startMoment) => {
    const { data, onChange } = this.props;
    const start = startMoment.startOf('day').toDate().getTime();
    onChange({...data, start});
  }

  onEndChange = (endMoment) => {
    const { data, onChange } = this.props;
    const end = endMoment.endOf('day').toDate().getTime();
    onChange({...data, end});
  }

  // Render

  render(){
    // Props
    const { 
      style,
      data,
    } = this.props;
    // Data
    const active = data ? true : false;
    // Render
    return (
      <div style={m(styles.container, style)}> 
        <div style={m(styles.row, active ? styles.bottomLine : null, styles.rowFirst)}>
          <div><strong>Карта очистки: </strong></div>
          <div>
            <Toggle 
              value={active}
              onChange={this.onActiveChange} 
            />
          </div>
        </div>
        { active ? this.renderMainPanel() : null }
      </div>
    );
  }

  renderMainPanel(){
    // Props
    const { data, processing } = this.props;
    // Data
    const {
      groups = [],
      period,
    } = data;
    // Render
    return (
      <div>
        <div style={m(styles.row)}>
          <strong>Техніка:</strong>
        </div>
        <div style={m(styles.row)}>
          <strong>Трактори</strong>
          <Toggle 
            value={groups.find((item) => (item === 'tracktors'))}
            onChange={(val) => this.onGorupChange('tracktors', val)} 
          />
        </div>
        <div style={m(styles.row)}>
          <strong>Посипальник</strong>
          <Toggle 
            value={groups.find((item) => (item === 'trucks'))}
            onChange={(val) => this.onGorupChange('trucks', val)} 
          />
        </div>
        <div style={m(styles.row, styles.bottomLine)}>
          <strong>Снігоприбиральники</strong>
          <Toggle 
            value={groups.find((item) => (item === 'snowremovers'))}
            onChange={(val) => this.onGorupChange('snowremovers', val)} 
          />
        </div>
        <div style={m(styles.row)}>
          <strong>Період:</strong>
        </div>
        <RadioGroup 
          style={m(styles.row)} 
          name="period"
          items={[
            { title: 'День', value: 'day' },
            { title: 'Тиждень', value: 'week' },
            { title: 'Свій', value: 'custom' },
          ]}
          value={period}
          onChange={this.onPeriodChange}
        />
        { period === 'custom' ? this.renderCustomPerios() : null }
        { this.renderPeriodLabel() }
        { processing ? this.renderLoading() : null }
      </div>
    );
  }

  renderCustomPerios(){
    // Props
    const { data } = this.props;
    // Data
    const { start, end } = data;
    // Render
    return (
      <div style={m(styles.row)}>
        <div style={m(styles.full, styles.rightIndent)}>
          <div><strong>Початок:</strong></div>
          <DatePicker 
            inputStyle={styles.datePickerInput}
            selected={moment(start)}
            onChange={this.onStartChange}
          />
        </div>
        <div style={m(styles.full, styles.leftIndent)}>
          <div><strong>Кінець:</strong></div>
          <DatePicker 
            inputStyle={styles.datePickerInput}
            selected={moment(end)}
            onChange={this.onEndChange}
          />
        </div>
      </div>
    );
  }

  renderPeriodLabel(){
    const { data } = this.props;
    const { period } = data;

    if(period === 'day'){
      const nowTs = Date.now();
      return (
        <div style={m(styles.row, styles.periodText)}>
          {`${tsToStr(nowTs - dayMs, 'DD.MM.YYYY HH:mm')} - ${tsToStr(nowTs, 'DD.MM.YYYY HH:mm')}`}
        </div>
      );
    }else if(period === 'week'){
      const nowTs = Date.now();
      return (
        <div style={m(styles.row, styles.periodText)}>
          {`${tsToStr(nowTs - weekMs, 'DD.MM.YYYY')} - ${tsToStr(nowTs, 'DD.MM.YYYY')}`}
        </div>
      );
    }else {
      const { start, end } = data;
      return (
        <div style={m(styles.row, styles.periodText)}>
          {`${tsToStr(start, 'DD.MM.YYYY')} - ${tsToStr(end, 'DD.MM.YYYY')}`}
        </div>
      );
    }
  }

  renderLoading(){
    return (
      <div style={m(styles.row, styles.loading)}>
        <span className="fa fa-spin fa-refresh" />
        <span style={styles.loadingText}>{`Завантаження...`}</span>
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
  periodText: {
    color: '#333',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '10px',
  },
  loading: {
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  loadingText: {
    display: 'inline-block',
    marginLeft: '6px',
  },
}

// Attach prop types
AnalyticsPanel.propTypes = propTypes;
AnalyticsPanel.defaultProps = defaultProps;

export default AnalyticsPanel;
