// Log
const log = require('utils/log').default.withModule('configStorage');

// Config Storage
const keyPrefix = 'kremen:';

const getFullKey = (key) => {
  return keyPrefix + key;
}

const get = (key) => {
  const fullKey = getFullKey(key);
  const valStr = localStorage.getItem(fullKey);
  if (valStr === undefined) return null;
  let val = null;
  try {
    val = JSON.parse(valStr);
  } catch (e) {
    log.err(e);
    return null;
  }
  return val;
}

const set = (key, val) => {
  const fullKey = getFullKey(key);
  const valStr = JSON.stringify(val);
  localStorage.setItem(fullKey, valStr);
}

// Keys

export const CONFIG_KEYS = {
  MAP_CENTER: 'mapCenter',
  MAP_ZOOM: 'mapZoom',
  ITEMS: 'items',
  STATUS_PANEL_TAB: 'statusPanelTab',
  TRACKING_ANALYTICS: 'trackingAnalytics',
};

// Export

export default {
  get,
  set,
};
