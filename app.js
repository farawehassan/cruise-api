const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const connectDb = require("./connection/database");
const auth = require('./routes/Auth');
const reports = require('./routes/Report');

process.on('uncaughtException', (err) => {
	// eslint-disable-next-line no-console
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	// eslint-disable-next-line no-console
	console.log(err.name, err.message);
	process.exit(1);
});

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
//Allow all requests from all domains & localhost
app.all('/*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
	next();
});

// Routes
app.use('/api/v1/user', auth);
app.use('/api/v1/reports', reports);

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(compression());
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))


const port = process.env.PORT || 3000;

let server;

connectDb()
	.then(() => {
		server = app.listen(port, () => {
			// eslint-disable-next-line no-console
			console.log(`App running on port ${port}...`);
		});
	})
	.catch(err => {
		console.log("Database connection failed");
	});


process.on('unhandledRejection', (err) => {
	// eslint-disable-next-line no-console
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	// eslint-disable-next-line no-console
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});

