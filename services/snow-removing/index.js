// Require
const firebase = require('firebase-admin');
const SnowRemovingParser = require('./lib/parser');
const mongo = require('./lib/db');
// Consts
const { name, version, description } = require('./package.json');
const secMs = 1000;
const minMs = secMs * 60;
const hourMs = minMs * 60;
const mongoDbName = 'snowRemoving';
// Log
const log = require('./lib/log').withModule('app');
// Info
log.info('v' + version);
log.info(description);

// Firebase

const fireServiceAccount = require('./serviceAccountKey.json');
firebase.initializeApp({
  credential: firebase.credential.cert(fireServiceAccount),
  databaseURL: "https://kremen-snow.firebaseio.com"
});
const realtimeDb = firebase.database();
const itemsRef = realtimeDb.ref('items/data');
const itemsModRef = realtimeDb.ref('items/modified');

const startProcessing = async () => {
  log('connecting to mongo');
  const { db } = await mongo.connect(mongoDbName);
  log('connecting to mongo done');
  const trackings = db.collection('trackings');
  log('ensuring indexes');
  await mongo.ensureIndexAsync(trackings, 'mid');
  await mongo.ensureIndexAsync(trackings, 'ts');
  log('ensuring indexes done');
  // Init parser
  const parser = new SnowRemovingParser();
  // Updated
  parser.on('updated', (itemsData) => {
    log('updating data at the firebase');
    const ts = Date.now();
    itemsRef.set(itemsData);
    itemsModRef.set(ts);
  });
  // Changed
  parser.on('changed', ({id, data}) => {
    const ts = Date.now();
    const { lat, lng } = data;
    log.info(`changed, ${id}: ${JSON.stringify(data)}`);
    log('adding track record');
    const record = { mid: id, ts, lat, lng };
    mongo.saveAsync(trackings, record).then(() => {
      log('adding track record done')
    }).catch((err) => {
      log.err(`adding track record err: ${err}`);
    });
  });
  // Start
  parser.start();
}

startProcessing().catch((err) => {
  log(`error: ${err}`);
  process.exit(1);
});
