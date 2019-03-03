const port = 4010;
const addr = '0.0.0.0';

const path = require('path');
const express = require('express');
const app = require('express')();
const url = require('url');
const axios = require('axios');
const http = require('http').Server(app);
const cors = require('cors');
const ioStart = require('./src/sockets');
const winston = require('winston'); // for transports.Console
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');

const router = express.Router();

const heroesRoles = require('./db/heroesRoles');

app.use(cors({credentials: true, origin: true}));
app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(express.methodOverride());

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// Now we can tell the app to use our routing code:
app.use(router);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

http.listen(port, addr);

ioStart(port);