import _ from 'lodash';

const mergeStylesInArray = (arr) => {
  if(!arr) return {};
  let style = {};
  _.each(arr, (item) => {
    if(!item) return;
    if(_.isString(item) || _.isNumber(item)) return;
    let styleObj = _.isArray(item) ? mergeStylesInArray(item) : item;
    _.forEach(styleObj, (val, key) => (style[key] = val));
  });
  return style;
}

export function mstyle(){
  return mergeStylesInArray(arguments);
}

export { default as mixings } from './mixings';
export { default as colors } from './colors';
export { default as sizes } from './sizes';
