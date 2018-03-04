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
const realdb = firebase.database();
const itemsModRef = realdb.ref('items/modified');

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
    const ts = Date.now();
    log('updating modTs at firebase');
    itemsModRef.set(ts);
  });
  // Changed
  parser.on('changed', ({id, data}) => {
    const ts = Date.now();
    const { lat, lng } = data;
    log.info(`changed, ${id}: ${JSON.stringify(data)}`);
    // Adding record to mongo
    log(`${id}: adding track record`);
    const record = { mid: id, ts, lat, lng };
    mongo.saveAsync(trackings, record).then(() => {
      log(`${id}: adding track record done`);
    }).catch((err) => {
      log.err(`${id}: adding track record err - ${err}`);
    });
    // Updating data at firebase
    log(`${id}: updating realtime data`);
    realdb.ref(`items/data/${id}`).set(data).then(() => {
      log(`${id}: updating realtime data done`);
    }).catch((err) => {
      log(`${id}: updating realtime data err - ${err}`);
    });
  });
  // Start
  parser.start();
}

startProcessing().catch((err) => {
  log(`error: ${err}`);
  process.exit(1);
});
