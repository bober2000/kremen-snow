// Require
const request = require('request');
const md5 = require('md5');
// Consts
const rootUrl = 'http://admin.logistika.org.ua:1999/';
// Log
const log = require('./log').withModule('parser');

// Helpers

RegExp.prototype.execAll = function(string) {
  let match = null;
  const matches = new Array();
  while (match = this.exec(string)) {
    const matchArray = [];
    for (const i in match) {
      if (parseInt(i) == i) {
        matchArray.push(match[i]);
      }
    }
    matches.push(matchArray);
  }
  return matches;
}

const asyncReq = (opt) => (
	new Promise((resolve, reject) => {
		request(opt, (err, res, body) => {
			if(err){
				reject({name: 'HTTP_REQ_ERR', descr: err.toString()});
			}else{
				if(res.statusCode > 299){
					const name = 'HTTP_WRONG_STATUS_CODE';
					const descr = res.statusCode + (body ? ': ' + body : '');
					reject({code: res.statusCode, name, descr});
				}else{
					resolve({res, body});
				}
			}
		});
	})
);

const getSessionIdFromBody = (body) => {
  if(!body) return null;
  const match = /MySID="(.+?)"/g.exec(body);
  return match ? match[1] : null;
}

const getAddTimerFromBody = (body) => {
  if(!body) return null;
  const match = /AddTimer\("(.+?)",(\d+)\)/g.exec(body);
  return match ? {name: match[1], val: Number.parseInt(match[2], 10)} : null;
}

const contentWidnowCmdsFromBody = (body) => {
  const reg = /contentWindow.(.+?)\((.*?)\)/g;
  const matches = reg.execAll(body);
  const arr = matches.map((match) => {
    const name = match[1];
    const rawParams = match[2];
    const params = !rawParams ? rawParams : rawParams.split(',').map(
      param => !param ? param : param.trim()
    );
    return {name, params};
  });
  return arr;
}

const clearTime = (timeStr) => {
  if(!timeStr) return timeStr;
  const match = /\d+:\d+:\d+/g.exec(timeStr);
  return match ? match[0] : '';
}

const clearStringParam = (param) => {
  if(!param) return param;
  const match = /("|')(.+?)("|')/g.exec(param);
  return match ? match[2] : '';
}

const relativeToAbsoluteUrl = (str) => {
  if(!str) return str;
  return `${rootUrl}${str}`;
}

const parseMachineryData = (dataStr) => {
  if(!dataStr) return null;
  const data = {};
  const rows = dataStr.split(/<br\/*>/g);
  rows.forEach(row => {
    const rowReg = /<b\s*>(.+?)[: ]*?<\/b\s*>\s*?(.+)/g;
    const match = rowReg.exec(row);
    if(!match){
      return log.err(`unnable to parse machinery row: "${row}"`);
    }
    if(!match[1]){
      return log.err(`unnable to parse machinery param name: "${row}"`);
    }
    if(!match[2]){
      return log.err(`unnable to parse machinery param value: "${row}"`);
    }
    const key = match[1].trim().toLocaleLowerCase();
    const val = match[2].trim();
    if(key === 'авто'){
      data.id = md5(val);
      data.name = val;
    }else if(key === 'компанія'){
      data.company = val;
    }else if(key === 'група'){
      data.group = val;
    }else if(key === 'швидкість'){
      data.speed = val;
    }else if(key === 'час'){
      data.time = clearTime(val);
    }else{
      data[key] = val;
    }
  });
  return data;
}

// SnowRemovingParser
class SnowRemovingParser{
  constructor(){
    this.machineries = [];
  }

  async start(){
    this.machineries = [];
    this.jar = request.jar();
    const { jar } = this;
    log('starting');
    log('getting session id');
    this.sid = await this.getSessionId();
    log(`getting session id done, sid: ${this.sid}`);
    log(`make configure req`);
    const confBody = await this.makeConfigureReq();
    log(`make configure req done`);
    log(`getting timer data`);
    const confAddTimer = getAddTimerFromBody(confBody);
    if(confAddTimer){
      this.startMonitoringWithTimer(confAddTimer);
    }else{
      throw new Error('conf add timer is empty');
    }
  }

  startMonitoringWithTimer({name, val}){
    log(`monitoring with sernder: ${name}`);
    if(this.monitHandler){
      clearInterval(this.monitHandler);
    }
    this.monitHandler = setTimeout(async () => {
      log(`making tick req with sender: ${name}`);
      const tickBody = await this.makeTickReq(name);
      log(`making tick req done`);
      this.processTickBody(tickBody);
      const tickAddTimer = getAddTimerFromBody(tickBody);
      if(tickAddTimer && (tickAddTimer.name !== name)){
        this.startMonitoringWithTimer(tickAddTimer);
      }else{
        this.startMonitoringWithTimer({name, val});
      }
    }, val);
  }

  async getSessionId(){
    const { jar } = this;
    const { res, body } = await asyncReq({url: rootUrl, jar});
    return getSessionIdFromBody(body);
  }

  async makeConfigureReq(){
    const { sid, jar } = this;
    const qs = { SID: sid, Sender: 'Cundefined', Event: 'CREATE' };
    const { res, body } = await asyncReq({url: rootUrl, qs, jar});
    return body;
  }

  async makeTickReq(sender){
    const { sid, jar } = this;
    const qs = { SID: sid, Sender: sender, Event: 'Tici' };
    const { res, body } = await asyncReq({url: rootUrl, qs, jar});
    return body;
  }

  processTickBody(body){
    const cmds = contentWidnowCmdsFromBody(body);
    const nowTs = Date.now();
    if(!cmds.length) return;
    let machineries = [...this.machineries];
    cmds.forEach(({name, params}) => {
      if(name === 'clear_source'){
        machineries = [];
      }else if(name === 'clear_array'){
        machineries = [];
      }else if(name === 'addDots'){
        const data = parseMachineryData(params[2]);
        if(!data){
          log.err(`parsing machinery data error, ${name}: ${JSON.stringify(params)}`);
        }else{
          const lat = Number.parseFloat(params[0]);
          const lng = Number.parseFloat(params[1]);
          const icon = relativeToAbsoluteUrl(clearStringParam(params[3]));
          machineries.push({...data, lat, lng, icon, modified: nowTs});
        }
      }else if(name === 'addLines'){

      }else if(name === 'addTrackOnMap'){

      }else if(name === 'addCarsOnMap'){

      }else{
        log(`unprocessed command, ${name}: ${JSON.stringify(params)}`);
      }
    });
    if(machineries.length){
      this.setMachineries(machineries);
    }
  }

  setMachineries(items){
    log(`setting new machineries, lenght: ${items.length}`);
  }

}

module.exports = SnowRemovingParser;
