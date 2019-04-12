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
const uniqid = require('uniqid');

/**TOKENS*/
const tokenList = [];

const addToken = (num) => {
    let _num = num ? num : 0;
    const token = uniqid('token');
    if (tokenList.find(t => t.val === token)) {
        tokenList.push({val: token, expired: setTimeout(function () {
                const fTokenIndex = tokenList.findIndex(t => t.val === token);
                if(fTokenIndex >= 0){
                    tokenList.splice(fTokenIndex, 1);
                }
            }, 1000 * 60 * 10)});
        return token;
    } else if(num < 10){
        return addToken(++_num);
    } else {
        return undefined;
    }
};
const findToken = (token) => {
    if(token.hasOwnProperty('val')){
        return tokenList.find(t => t.val === token.val);
    } else if(typeof token === 'string') {
        return tokenList.find(t => t.val === token);
    }
};
const removeToken = (token) => {
    const fTokenIndex = findToken(token);

    if(fTokenIndex >= 0) {
        clearTimeout(tokenList[fTokenIndex].expired);
        tokenList.splice(fTokenIndex, 1);
        return true;
    } else {
        return false;
    }
};
/**TOKENS*/

/**FIREBASE**/
const firebase = require('firebase');
firebase.initializeApp({
    apiKey: "AIzaSyCf9GH0ejD0AsTc-fpeEdiuqyXkvzXoYaQ",
    authDomain: "chat-6855d.firebaseapp.com",
    databaseURL: "https://chat-6855d.firebaseio.com",
    projectId: "chat-6855d",
    storageBucket: "chat-6855d.appspot.com",
    messagingSenderId: "387186080497"
});
const db = firebase.firestore();

const participantsGet = () => {
    return db.collection('participants').get().then((snapshot) => snapshot.docs.map(doc => doc.data()));
};
/**FIREBASE**/

const router = express.Router();

const heroesRoles = require('./db/heroesRoles');

app.use(cors({credentials: true, origin: true}));
app.use('/', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
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

app.post('/participant/create', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /**
     * -Взять с тела запроса идишник и имя
     */
    const {id, name} = req.body;
    const result = {};

    /** -Проверить идишник в базе данных (есть ли такой же)*/
    if (participantsGet().find(p => p.id === id) >= 0) {
        result.error = 'Уже есть такой в базе. Кышъ'
    } else {
        /** -(Сформировать токен если все ОК)*/
        result.token = addToken().val;

        result.name = name;
        result.id = id;
    }

    res.json(result);
});

app.post('/participant/login', function (req, res) {
    if (!req.body) return res.sendStatus(400);
    /** -Взять с тела запроса идишник */
    const id = req.body.id;
    const result = {};

    /** -Проверить идишник в базе данных (есть ли такой же)*/
    if (participantsGet().find(p => p.id === id) >= 0) {
        result.token = addToken().val;
        result.name = name;
        result.id = id;
    } else {
        /** -(Сформировать токен если все ОК)*/
        result.error = 'В базе нет такого пользователя. Кышъ';
    }

    res.json(result);
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

http.listen(port, addr, 551, () => {
    console.log('server started')
});
ioStart(port);