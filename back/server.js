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

const Tokens = require('./src/tokens')({uniqid});
const {
    addObject,
    findObjectIndex,
    removeObject,
    getObject,
    setRSAKeyOnObject
} = Tokens;

const Firebase = require('./src/firebase');
const {Participant, Conversation, Message} = Firebase();

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
    const {id} = user;
    const result = {};

    if(!id){
        user.id = moment().unix() + '_' + uniqid.process();
    }

    Participant.add(user).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.authToken = addObject();
            result.user = {...user, id: data.id};
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

/**req = {user} res = {user || error}*/
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

/**req = {id} res = {token, id || error}*/
app.post('/participant/login', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /** -Взять с тела запроса идишник */
    const {id} = req.body;
    const result = {};

    /** -Проверить идишник в базе данных (есть ли такой же)*/
    Participant.getAll().then(participants => {
        if (participants.find(p => p.id === id)) {
            result.token = addObject(0, id);
            result.id = id;
        } else {
            result.error = 'В базе нет такого пользователя. Кышъ';
        }
        res.json(result);
    });
});

/**req = {token, id} res = {status, token || error}*/
app.post('/participant/logout', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /** -Взять с тела запроса authToken, userId*/
    const {token, id} = req.body;
    const result = {};

    console.log('logout');

    /** -Проверить authToken и удалить если будет*/
    removeObject(token, id);

    result.status = 200;
    result.token = token;

    res.json(result);
});

app.post('/conversation/create', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {conversation} = req.body;
    const {id} = conversation;
    const result = {};

    if(!id){
        conversation.id = 'conv' + moment().unix() + '_' + uniqid.process();
    }

    Conversation.add(conversation).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.conversation = {...conversation, id: data.id};
        }

        res.json(result);
    });
});

app.post('/conversation/edit', function (req, res) {
    if (!req.body) return res.sendStatus(400);
});

app.post('/conversation/get', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const result = {};

    Conversation.get(req.body).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.conversation = data;
        }

        res.json(result);
    })

});

app.post('/message/get', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {id} = req.body;
    const result = {};

    Message.get(id).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.message = data;
        }

        res.json(result);
    })

});

app.post('/message/create', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {message} = req.body;
    const result = {};

    Message.add(message).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.message = data;
        }

        res.json(result);
    })

});

app.post('/message/edit', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {message} = req.body;
    const result = {};

    Message.edit(message).then(data => {
        if(data.error){
            result.error = data.error;
        } else {
            result.message = data;
        }

        res.json(result);
    })

});

/**req = {token, id} res = { || error}*/
app.post('/authToken/check', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {token, id} = req.body;
    const result = {};

    if(token !== undefined && id !== undefined) {
        if(findObjectIndex(token, id) !== -1){

        } else {
            result.error = 'Token expired or not exist. Please relogin.'
        }

        res.json(result);
    } else {
        return res.sendStatus(400);
    }
});

/**req = {token, id, key } res = {key || error}*/
app.post('/authToken/key', function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const {token, id, key} = req.body;
    const result = {};

    if(token !== undefined && id !== undefined && key !== undefined ) {

        const object = setRSAKeyOnObject(token, id, key);

        if(object.rsaKey === key) {
            result.key = rsaWrapper.arrayBufferToUtf8(rsaWrapper.getPublicKey('server'));
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
    Tokens
});
