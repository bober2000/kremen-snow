// Require
const express = require('express');
const mongo = require('./lib/db');
// Consts
const { name, version } = require('./package.json');
const dbName = 'snowRemoving';
// Log
const log = require('./lib/log').withModule('app');

const init = async () => {
  log('connecting to mongo');
  const { db } = await mongo.connect(dbName);
  log('connecting to mongo done');
  // Creating collections
  const trackings = db.collection('trackings');
  const equipment = db.collection('equipment');

  // Creating app
  const app = express();

  // API

  const asyncWrap = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if(!err){
        return res.status(500).json({name: 'SERVER_ERR'});
      }else if(typeof err === 'string'){
        return res.status(500).json({name: 'SERVER_ERR', descr: err});
      }else if(err.name && err.code && err.descr){
        return res.status(err.code).json({name: err.name, descr: err.descr});
      }else if(err.name && err.code){
        return res.status(err.code).json({name: err.name});
      }else if(err.name){
        return res.status(500).json({name: err.name});
      }else if(typeof err.toString === 'function'){
        return res.status(500).json({name: err.toString()});
      }else{
        return res.status(500).json({name: 'UNPROCESSIBLE_ERR'});
      }
    });
  };

  const groupToAltNames = (rawStr) => {
    if(!rawStr) return null;
    switch(rawStr.trim().toLowerCase()){
      case 'посипальник':
      case 'trucks':
      case 'dumptrucks':
        return ['Посипальники', 'посипальники', 'trucks', 'dumptrucks'];
      case 'трактори':
      case 'tracktors':
        return ['Трактори', 'трактори', 'tracktors'];
      case 'снігоприбиральники':
      case 'snowremovers':
      case 'removers':
        return ['Снігоприбиральники', 'снігоприбиральники', 'removers', 'snowremovers'];
      default:
        return null;
    }
  }
  

  app.get('/', (req, res) => {
    res.json({name, version});
  });

  app.get('/equipment', asyncWrap(async (req, res) => {
    const items = await equipment.find().toArray();
    res.json(items);
  }));

  app.get('/trackings/:group', asyncWrap(async (req, res) => {
    const { query = {}, params = {} } = req;
    // Group
    if(!params.group) throw {code: 402, name: 'REQ_PARAM_NOT_SET', descr: 'group'};
    // Start
    if(!query.start) throw {code: 402, name: 'REQ_PARAM_NOT_SET', descr: 'start'};
    const startTs = Number.parseInt(query.start, 10);
    if(Number.isNaN(startTs)) throw {code: 402, name: 'REQ_PARAM_ERR', descr: '"start" is not a number'};
    // To
    if(!query.end) throw {code: 402, name: 'REQ_PARAM_NOT_SET', descr: 'end'};
    const endTs = Number.parseInt(query.end, 10);
    if(Number.isNaN(endTs)) throw {code: 402, name: 'REQ_PARAM_ERR', descr: '"end" is not a number'};
    
    const groupNames = groupToAltNames(params.group);
    if(!groupNames) throw {code: 402, name: 'UNKNOW_GROUP_NAME', descr: params.group};
    const machines = await equipment.find({group: {'$in': groupNames}}).project({_id: 1}).toArray();
    if(!machines || machines.lenght){
      const descr = `Equipment with "${params.group}" name not found`;
      throw {code: 402, name: 'EQUIPMENT_NOT_FOND', descr};
    }
    const machinesIds = machines.map((item) => (item._id));
    const trackingsQuery = {
      mid: {'$in': machinesIds},
      ts: {
        '$gte': startTs,
        '$lte': endTs,
      }
    };
    const records = await trackings.find(trackingsQuery).project({lat: 1, lng: 1, _id: 0}).toArray();
    res.json(records);
  }));

  app.all('*', asyncWrap(async (req, res) => {
    throw {code: 404, name: 'NOT_FOUND', descr: 'api endpoint not found'};
  }));

  // Starting api
  const port = process.env.PORT || 8080
  log(`starting app on port: ${port}`);
  app.listen(port, () => log(`starting app done`));
}

// Init server
log(`app init`)
init().then(() => {
  log(`app init done`);
}).catch((err) => {
  log.err(`app init done with err - ${err.toString()}`);
});
