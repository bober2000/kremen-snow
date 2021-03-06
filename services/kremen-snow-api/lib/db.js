// Require
const mongodb = require('mongodb');
const log = require('./log');
// Db
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017';

// Functions

const connect = (dbName) => (
  new Promise((resolve, reject) => (
    mongoClient.connect(url, (err, client) => (
      err ? reject(err) : resolve({db: client.db(dbName), client})
    ))
  ))
);

const ensureIndexAsync = (collection, index) => (
  new Promise((resolve, reject) => (
    collection.ensureIndex(index, (err, data) => (
      err ? reject(err) : resolve(data)
    ))
  ))
);

// Exports

module.exports = {
  connect,
  ensureIndexAsync,
};
