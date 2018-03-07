// Utils
import _ from 'lodash';
// Consts
const apiRoot = `https://api.io.kr.ua/snow`;
// Log
const log = require('utils/log').default.withModule('api');

// Helpers

const valToTs = (val) => {
  if(_.isNumber(val)) return val;
  if(_.isDate(val)) return val.getTime();
  if(_.isString(val)){
    const ts = (new Date(val)).getTime();
    if(Number.isNaN(ts)){
      throw new Error(`Wrong date string format: ${val}`);
    }else{
      return ts;
    }
  }
  throw new Error(`Unsuported date format: ${val}`);
}

// Api

const objToQs = (params) => {
  const esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&')
};

export const apiReq = async ({path, qs}) => {
  const fullUrl = qs ? `${apiRoot}${path}?${objToQs(qs)}` : `${apiRoot}/path`;
  log(fullUrl);
  const res = await fetch(fullUrl);
  if(!res.ok) throw `Wrong response status: ${res.status}`;
  return res.json();
}

export const getTrackings = async ({start, end, group}) => {
  const qs = { start: valToTs(start), end: valToTs(end) };
  return apiReq({path: `/trackings/${group}`, qs});
}

export const getTruckTrackings = async ({start, end}) => {
  return getTrackings({start, end, group: 'trucks'})
}

export const getTracktorsTrackings = async ({start, end}) => {
  return getTrackings({start, end, group: 'tracktors'})
}

export const getSnowRemoversTrackings = async ({start, end}) => {
  return getTrackings({start, end, group: 'snowremovers'})
}
