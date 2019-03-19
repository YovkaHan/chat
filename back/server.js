const port = 4010;
const addr = '0.0.0.0';
const uniqid = require('uniqid');

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

/**data: [{id, socket}]*/
const participants = {
    data: [
        {id: uniqid(), socket: 'idSocket', name: 'Test Contact'}
    ],
    maxCount: 2,
    add: function (socket, name) {
        if (this.maxCount > 0) {
            const cId = uniqid();
            this.data.push({id: cId, socket, name});
            this.maxCount--;
            return cId;
        }

        return undefined;
    },
    list: function () {
        return this.data.map(item => item.id)
    },
    remove: function (participant) {
        const _participantIndex = this.data.findIndex(p => p.id === participant.id);
        if (_participantIndex >= 0) {
            this.data.splice(_participantIndex, 1);
            this.maxCount++;
        }
    }
};

/**data: [{id, socket}]*/
const conversations = {
    data: [],
    maxCount: 1,
    add: function (participantA, participantB) {
        if (this.maxCount > 0) {
            const cId = uniqid();
            this.data.push({idA: participantA.id, idB: participantB.id, cId});
            this.maxCount--;
            return cId;
        }

        return undefined;
    },
    remove: function (cId) {
        const conversationIndex = this.data.findIndex(c => c.cId === cId);

        if (conversationIndex) {
            this.data.splice(1, conversationIndex);
            return cId;
        } else {
            return undefined;
        }
    }
};

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

module.exports = {
    participants,
    conversations
};

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

app.get('/contacts', (req, res) => {
    res.send(participants.list());
});

http.listen(port, addr);

ioStart(http);