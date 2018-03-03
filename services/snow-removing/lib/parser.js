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

const marchineryDataToId = (data) => {
  if(!data || !data.name) return null;
  return md5(data.name);
}

const isItemsDifferen = (a, b) => {
  if(!a || !b) return true;
  if((a.name !== b.name) || 
     (a.company !== b.company) || 
     (a.group !== b.group) || 
     (a.speed !== b.speed) || 
     (a.lat !== b.lat) || 
     (a.lng !== b.lng)){
    return true;
  }else{
    return false;
  }
}

// SnowRemovingParser
class SnowRemovingParser{
  constructor(){
    this.machineries = {};
    this.handlers = [];
  }

  async start(){
    this.machineries = {};
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

  async restart(){
    if(this.monitHandler){
      clearTimeout(this.monitHandler);
    }
    return this.start();
  }

  startMonitoringWithTimer({name, val}){
    log(`monitoring with sernder: ${name}`);
    if(this.monitHandler){
      clearTimeout(this.monitHandler);
    }
    this.monitHandler = setTimeout(async () => {
      log(`making tick req with sender: ${name}`);
      const tickBody = await this.makeTickReq(name);
      log(`making tick req done`);
      if(tickBody){
        this.processTickBody(tickBody);
      }else{
        log.err('tick body empty');
      }
      const tickAddTimer = getAddTimerFromBody(tickBody);
      if(tickAddTimer && (tickAddTimer.name !== name)){
        log(`new timer found: ${tickAddTimer.name}`);
        this.startMonitoringWithTimer(tickAddTimer);
      }else{
        log('new timer not found');
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
    let machineries = {...this.machineries};
    cmds.forEach(({name, params}) => {
      if(name === 'clear_source'){
        machineries = {};
      }else if(name === 'clear_array'){
        machineries = {};
      }else if(name === 'addDots'){
        const info = parseMachineryData(params[2]);
        if(!info){
          log.err(`parsing machinery info error, ${name}: ${JSON.stringify(params)}`);
        }else{
          const lat = Number.parseFloat(params[0]);
          const lng = Number.parseFloat(params[1]);
          const icon = relativeToAbsoluteUrl(clearStringParam(params[3]));
          const id = marchineryDataToId(info);
          machineries[id] = { ...info,  lat, lng, icon};
        }
      }else if(name === 'addLines'){

      }else if(name === 'addTrackOnMap'){

      }else if(name === 'addCarsOnMap'){

      }else{
        log(`unprocessed command, ${name}: ${JSON.stringify(params)}`);
      }
    });
    if(Object.keys(machineries).length){
      this.setMachineries(machineries);
    }
  }

  setMachineries(newItems){
    const modified = Date.now();
    log(`setting new machineries, lenght: ${Object.keys(newItems).length}`);
    Object.keys(newItems).forEach(id => {
      const newItem = newItems[id];
      const oldItem = this.machineries[id];
      if(!oldItem){
        this.machineries[id] = {...newItem, modified};
        this.emit('changed', {id, data: this.machineries[id]});
      }else if(isItemsDifferen(newItem, oldItem)){
        this.machineries[id] = {...newItem, modified};
        this.emit('changed', {id, data: this.machineries[id]});
      }
    });
    this.emit('updated', this.machineries);
  }

  // Emit

  on(name, cb){
    this.handlers.push({name, cb});
  }

  emit(name, data){
    this.handlers.forEach(handler => {
      if(handler.name === name){
        handler.cb(data);
      }
    })
  }

}

module.exports = SnowRemovingParser;
