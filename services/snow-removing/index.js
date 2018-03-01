// Consts
const { name, version, description } = require('./package.json');
// Log
const log = require('./lib/log').withModule('app');
// Lib
const SnowRemovingParser = require('./lib/parser');

// Info
log.info('v' + version);
log.info(description);

// Firebase

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kremen-city.firebaseio.com"
});
const db = admin.database();
const itemsRef = db.ref('snowRemoving/items');
const modifiedRef = db.ref('snowRemoving/modified');

const firestore = admin.firestore();

// Parser
const parser = new SnowRemovingParser();

parser.on('updated', (itemsData) => {
  log('updating data at the firebase');
  const ts = Date.now();
  itemsRef.set(itemsData);
  modifiedRef.set(ts);
});

parser.on('changed', ({id, data}) => {
  const ts = Date.now();
  const { lat, lng } = data;
  const record = {id, ts, lat, lng};
  log.info(`changed, ${id}: ${JSON.stringify(data)}`);
  log('adding track record');
  firestore.collection('snowRemovingTrack').add(record).then(() => {
    log('adding track record done');
  }).catch((err) => {
    log(`adding track record err: ${err}`);
  });
});

parser.start();
