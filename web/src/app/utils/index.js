// ID

function genId() {
  return Math.random().toString(36).substr(2, 24);
}

// Strings

function pad(val, max) {
  const str = val.toString();
  return str.length < max ? pad(`0${str}`, max) : str;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Dates

const minSec = 60;
const hourSec = minSec * 60;
const daySec = hourSec * 24;
const dayMillisec = daySec * 1000;


// Export

export default {
  id: {
    genId,
  },
  str: {
    pad,
    capitalizeFirstLetter,
  },
  date: {
    minSec,
    hourSec,
    daySec,
    dayMillisec,
  },
};
