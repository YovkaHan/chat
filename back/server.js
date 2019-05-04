const port = 4010;
const addr = 'localhost';

const path = require('path');
const express = require('express');
const app = require('express')();
const url = require('url');
const axios = require('axios');
const server = require('http').Server(app);
const cors = require('cors');
const ioStart = require('./src/sockets');
const winston = require('winston'); // for transports.Console
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');
const moment = require('moment');
const rsaWrapper = require('./src/rsa-wrapper');

//rsaWrapper.initLoadServerKeys('./back/src');
// rsaWrapper.serverExampleEncrypt();

// require('./src/keysGenerate');

const {
    addObject,
    findObjectIndex,
    removeObject,
    getObject,
    setKeyOnObject
} = require('./src/tokens')({uniqid});

const Firebase = require('./src/firebase');
const {Participant} = Firebase();

const router = express.Router();

app.use(cors({credentials: true, origin: true}));
app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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

app.get('/participant/idGenerate', function (req, res) {
    const result = {};

    result.id = moment().unix() + '_' + uniqid.process();

    res.json(result);
});

app.post('/participant/create', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {user} = req.body;
    const result = {};

    Participant.add(user).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.token = addObject();
            result.user = user;
        }

        res.json(result);
    });
});

app.post('/participant/edit', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {user} = req.body;
    const result = {};

    Participant.edit(user).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.user = data;
        }

        res.json(result);
    });
});

app.post('/participant/get', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {user} = req.body;
    const result = {};

    Participant.get(user).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.user = data;
        }

        res.json(result);
    });
});

app.post('/participant/login', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /** -Взять с тела запроса идишник */
    const id = req.body.id;
    const result = {};

    /** -Проверить идишник в базе данных (есть ли такой же)*/
    Participant.multiGet().then(participants => {
        if (participants.find(p => p.id === id)) {
            result.token = addObject(0, id);
            result.id = id;
        } else {
            result.error = 'В базе нет такого пользователя. Кышъ';
        }
        res.json(result);
    });
});

app.post('/participant/logout', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /** -Взять с тела запроса token, userId*/
    const {token, userId} = req.body;
    const result = {};

    console.log('logout');

    /** -Проверить token и удалить если будет*/
    removeObject(token, userId);

    result.status = 200;
    result.token = token;

    res.json(result);
});

app.post('/conversation/new', function (req, res) {
    if (!req.body) return res.sendStatus(400);
});

app.post('/conversation/info', function (req, res) {
    if (!req.body) return res.sendStatus(400);
});

app.post('/token/check', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {token, userId} = req.body;
    const result = {};

    if(token !== undefined && userId !== undefined) {
        if(findObjectIndex(token, userId) !== -1){

        } else {
            result.error = 'Token expired or not exist. Please relogin.'
        }

        res.json(result);
    } else {
        return res.sendStatus(400);
    }
});

app.post('/token/key', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {token, userId, key} = req.body;
    const result = {};

    if(token !== undefined  && userId !== undefined  && key !== undefined ) {

        const object = setKeyOnObject(token, userId, key);

        if(object.key === key) {
            result.key = rsaWrapper.getPublicKey('server');
        } else {
            result.error = 'Something happen!'
        }
        
        res.json(result);
    } else {
        return res.sendStatus(400);
    }
});

server.listen({
    port, addr,
}, () => {
    console.log('server started')
});
ioStart({
    server,
    getObject,
    rsaWrapper
});
