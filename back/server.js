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

const {addToken, findTokenIndex, removeToken} = require('./src/tokens')({uniqid});

const {participantsGet, participantAdd} = require('./src/firebase')();

const router = express.Router();

const heroesRoles = require('./db/heroesRoles');

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
    /**
     * -Взять с тела запроса идишник и имя
     */
    const {id, name} = req.body;
    const result = {};

    console.log(id);

    if (id === undefined && name === undefined) {
        return res.sendStatus(400);
    }

    /** -Проверить идишник в базе данных (есть ли такой же)*/
    participantsGet().then(participants => {
        if (participants.find(p => p.id === id)) {
            result.error = 'Уже есть такой в базе. Кышъ'
        } else {
            /** -(Сформировать токен если все ОК)*/
            result.token = addToken();

            result.name = name;
            result.id = id;

            participantAdd({id, name});
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
    participantsGet().then(participants => {
        if (participants.find(p => p.id === id)) {
            result.token = addToken();
            result.id = id;
        } else {
            result.error = 'В базе нет такого пользователя. Кышъ';
        }
        res.json(result);
    });
});

app.post('/participant/logout', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /** -Взять с тела запроса token */
    const token = req.body.token;
    const result = {};

    /** -Проверить token и удалить если будет*/
    removeToken(token);

    result.status = 200;

    res.json(result);
});

app.post('/conversation/new', function (req, res) {
    if (!req.body) return res.sendStatus(400);
});

app.post('/conversation/info', function (req, res) {
    if (!req.body) return res.sendStatus(400);
});

server.listen({
    port, addr,
}, () => {
    console.log('server started')
});
ioStart(server);
