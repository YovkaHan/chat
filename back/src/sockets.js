module.exports = function ({server, Tokens}) {
    const io = require('socket.io')(server);
    const Firebase = require('./firebase');
    const {Participant, Conversation, Message,  MessageList} = Firebase();
    const events = require('./eventManager');
    const {GlobalEventManager, LocalEventManager} = events();
    const uniqid = require('uniqid');
    const rsaWrapper = require('./rsa-wrapper');
    const aesWrapper = require('./aes-wrapper');

    const _GlobalEventManager = GlobalEventManager();

    const LocalEventManagers = {};

    io.on('connection', (socket) => {

        console.log('user connected !!!!');

        socket.on('disconnect', function () {

            delete LocalEventManagers[socket.id];

            console.log('user disconnected !!!!');
        });

        socket.on('chat.connect.firstHandshake', function (data) {
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const privateServerKey = rsaWrapper.getPrivateKey('server');

                    if(tokenObject.authToken === rsaWrapper.decrypt(privateServerKey, msg)){
                        const aesKey = aesWrapper.generateKey();
                        const publicClientKey = tokenObject.rsaKey;

                        Tokens.setAESKeyOnObject(token, aesWrapper.arrayBufferToBase64String(aesKey)).then(()=>{
                            socket.emit('chat.connect.firstHandshake.success', {
                                msg: rsaWrapper.encrypt(publicClientKey, aesKey.toString('base64'))
                            });
                        });
                    }else {
                        socket.emit('chat.connect.firstHandshake.error');
                    }
                } else {
                    socket.emit('chat.connect.firstHandshake.error');
                }
            });
        });

        socket.on('chat.connect.secondHandshake', function (data) {
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');

                    if(tokenObject.authToken === aesWrapper.decrypt(aesKey, msg)){
                        // const EM = new GlobalEventManager({socket, userId: tokenObject.userId});
                        // EventManagers[tokenObject.userId] = EM;
                        socket.emit('chat.connect.secondHandshake.success');
                    }else {
                        socket.emit('chat.connect.secondHandshake.error');
                    }
                } else {
                    socket.emit('chat.connect.secondHandshake.error');
                }
            });
        });

        socket.on('chat.disconnect', function () {
            console.log('chat.disconnect');
            socket.emit('chat.disconnect.success');
            socket.emit('disconnect');
        });

        socket.on('chat.connection', function () {
            console.log('chat.connection');
            socket.emit('chat.connection.success');
        });

        socket.on('chat.user.info', function (data) {
            /**encryptedMsg === {login || id}*/
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');

                    const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                    Participant.get(_data).then(user => {

                        socket.emit('chat.user.info', {
                            msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(user))
                        })
                    });
                }
            });
        });

        socket.on('chat.user.contacts', function (data) {
            /**encryptedMsg === {login || id}*/
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');

                    const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                    Participant.safeGet({id: _data.userId, get: 'contacts'}).then(contacts => {

                        socket.emit('chat.user.contacts', {
                            msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(contacts))
                        })
                    });
                }
            });
        });

        socket.on('chat.user.conversations', function (data) {
            /**encryptedMsg === {login || id}*/
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');

                    const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                    Participant.safeGet({id: _data.userId, get: 'conversations'}).then(conversations => {

                        socket.emit('chat.user.conversations', {
                            msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(conversations))
                        })
                    });
                }
            });
        });

        socket.on('chat.conversation.get', function (data) {
            /**encryptedMsg === {login || id}*/
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');

                    const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                    Conversation.get({id: _data.id}).then(conversation => {

                        socket.emit('chat.conversation.get', {
                            msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(conversation))
                        })
                    });
                }
            });
        });

        socket.on('event', function (data) {
            /**encryptedMsg === {login || id}*/
            const {token, msg} = data;

            Tokens.getObject(token).then(async tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');

                    const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                    const eventData = _GlobalEventManager.eventToData(_data);
                    const {message, conversation} = eventData;

                    const _conversation = await Conversation.getUnsafe(conversation);

                    let promises = _conversation.set === 'multi' ? ['from'] : ['from', 'to'];

                    promises = promises.map(async p => {
                       const pRes = await Participant.get({login: message[p]});
                       if(!pRes.hasOwnProperty('error')){
                           message[p] = pRes.id;
                       }
                    });

                    const msgId = await Promise.all(promises).then(()=>{
                        /**Create/Add Message*/
                        return Message.add(message).then(async msgResult=>{
                            if(!msgResult.hasOwnProperty('error')){
                                if(conversation.hasOwnProperty('id')){
                                    /**Add message to Message List*/
                                    const result = await MessageList.addMessage({id: _conversation.messageListId, msgId: msgResult.id});
                                }else {
                                    console.error('No conversation ID in Event Data')
                                }
                                return msgResult.id;
                            }else {
                                console.error(msgResult.error.text)
                            }
                        });
                    });
                    _GlobalEventManager.eventProcess(_data, {msgId});
                }
            });
        });

        /**Точка отсчета для LocalEventManager а*/
        socket.on('event.manager.last', function (data) {
            const {token, msg} = data;

            Tokens.getObject(token).then(tokenObject => {
                if(tokenObject !== undefined){
                    const aesKey = Buffer.from(tokenObject.aesKey, 'base64');
                    const {userId} = tokenObject;

                    const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));
                    const {lastEvents} = _data;

                    LocalEventManagers[socket.id] = new LocalEventManager({socket, userId, lastEvents, tokenObject});
                }
            });
        });

    });
};

/**
 * Запрос на коннект
 * */