process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const error = require('./lib/utils').error;
const log = require('./lib/utils').log;

const app = express();

const mongoUri = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost:27017';

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.static(path.join(__dirname, '/assets')));

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
	next();
});

app.use((err, req, res, next) => {
	console.log(err);
	next();
});
mongoose.connect(`${mongoUri}/test`);
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', () => {
	throw new Error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

db.once('open', () => {
	log('Mongoose', 'app.js:47', 'Connected to MongoDB');
	process.on('uncaughtException', (err) => {
		error('uncaughtException', 'app.js:49', err);
	});
	console.log('app.js:47 - ', process.env);
	require('./api/api')(app);
	if (process.env.NODE_ENV === 'production') {
		app.get('/*', (req, res) => {
			res.sendFile(path.join(__dirname, '../dist/index.html'));
		});
	}
});

module.exports = app;
