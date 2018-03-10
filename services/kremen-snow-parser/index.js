// Require
const firebase = require('firebase-admin');
const SnowRemovingParser = require('./lib/parser');
const mongo = require('./lib/db');
// Consts
const { name, version, description } = require('./package.json');
const secMs = 1000;
const minMs = secMs * 60;
const hourMs = minMs * 60;
const mongodbName = process.env.MONGODB_NAME || 'snowRemoving';
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
const firedb = firebase.database();

const startProcessing = async () => {
  log(`connecting to mongodb with name "${mongodbName}"`);
  const { db } = await mongo.connect(mongodbName);
  log('connecting to mongodb done');
  const trackings = db.collection('trackings');
  const equipment = db.collection('equipment');
  log('ensuring indexes');
  await mongo.ensureIndexAsync(trackings, 'mid');
  await mongo.ensureIndexAsync(trackings, 'ts');
  log('ensuring indexes done');
  // Init parser
  const parser = new SnowRemovingParser();
  // Updated
  parser.on('updated', (itemsData) => {
    log('updating modTs at firebase');
    firedb.ref('items/modified').set(Date.now()).catch((err) => {
      log(`updating modTs at firebase err - ${err}`);
    });
  });
  // Changed
  parser.on('changed', ({id, data}) => {
    const ts = Date.now();
    const { lat, lng } = data;
    log.info(`changed, ${id}: ${JSON.stringify(data)}`);
    // Adding tracking record to mongo
    log(`${id}: adding track record`);
    const trackingRecord = { mid: id, ts, lat, lng };
    trackings.save(trackingRecord, {w:1}).then(() => {
      log(`${id}: adding track record done`);
    }).catch((err) => {
      log.err(`${id}: adding track record err - ${err}`);
    });
    // Update equipment record
    log(`${id}: updating equipment record`);
    equipment.update({_id: id}, data, {upsert: true}).then(() => {
      log(`${id}: updating equipment record done`);
    }).catch((err) => {
      log(`${id}: updating equipment record err - ${err}`);
    });
    // Updating data at firebase
    log(`${id}: updating realtime data`);
    firedb.ref(`items/data/${id}`).set(data).then(() => {
      log(`${id}: updating realtime data done`);
    }).catch((err) => {
      log(`${id}: updating realtime data err - ${err}`);
    });
  });
  // Start
  parser.start().catch((err) => {
    log.err(`start err - ${err}`);
    throw err;
  });
}

// Catch unhandled rejecctions
process.on('unhandledRejection', (err) => {
  log.err(`unhandled rejection`);
  log.err(err);
  process.exit(1);
});

// Start processing
startProcessing().catch((err) => {
  log.err(`error: ${err}`);
  process.exit(1);
});
