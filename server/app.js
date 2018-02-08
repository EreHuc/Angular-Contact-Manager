process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let error = require('./lib/utils').error;
let log = require('./lib/utils').log;

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT");
	next();
});

app.use((err, req, res, next) => {
	console.log(err);
	next();
});

mongoose.connect('mongodb://localhost:27017/test');
const db = mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', () => {
	throw new Error('MongoDB Connection Error. Please make sure that MongoDB is running.');
	process.exit(1);
});

db.once('open', function () {
	log('Mongoose', 'app.js:47', 'Connected to MongoDB');
	process.on('uncaughtException', function(err) {
		error('uncaughtException', 'app.js:49', err);
	});
	let api = require('./api/api')(app);
	if (process.env.NODE_ENV === 'production') {
		app.get('/*', function (req, res) {
			if (req.url === '/')
				res.sendFile(path.join(__dirname, '../dist/index.html'));
			else {
				res.sendFile(path.join(__dirname, '../dist/', req.url));
			}
		});
	}
});

module.exports = app;
