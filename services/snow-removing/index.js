// Consts
const { name, version, description } = require('./package.json');
const { errors } = require('./common/consts');
// Common
const { asyncWrap } = require('./common/async');
const log = require('./lib/log').withModule('app');
// Lib
const SnowRemovingParser = require('./lib/parser');
const parser = new SnowRemovingParser();
parser.start();

// App
const app = require('express')();
// Adding custom responses
require('./common/responses')(app, name);

// Info
log.info('v' + version);
log.info(description);

// Default
app.get('/', (req,res) => {
  res.result({name, version, description});
});

// Default response
app.all('/*', (req,res) => {
  res.err({name: errors.UNKNOW_API_ENDPOINT, descr: {url: req.url, method: req.method}});
});

// Run
const appPort = process.env.PORT || 8080;
app.listen(appPort, () => {
	log.info(`listening on port: ${appPort}`);
});
