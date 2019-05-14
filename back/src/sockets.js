module.exports = function ({server, Tokens}) {
    const io = require('socket.io')(server);
    const Firebase = require('./firebase');
    const {Participant} = Firebase();
    const uniqid = require('uniqid');
    const rsaWrapper = require('./rsa-wrapper');
    const aesWrapper = require('./aes-wrapper');
    const { getObject, setAESKeyOnObject} = Tokens;

    //
    // /**data: [{id, socket}]*/
    // const participants = {
    //     data: [],
    //     maxCount: 2,
    //     add: function (socket) {
    //         if (this.maxCount > 0) {
    //             const cId = uniqid();
    //             this.data.push({id: cId, socket});
    //             this.maxCount--;
    //             return cId;
    //         }
    //
    //         return undefined;
    //     },
    //     remove: function (participant) {
    //         const _participantIndex = this.data.findIndex(p => p.id === participant.id);
    //         if (_participantIndex >= 0) {
    //             this.data.splice(_participantIndex,1);
    //             this.maxCount++;
    //         }
    //     }
    // };
    //
    // /**data: [{id, socket}]*/
    // const conversations = {
    //     data: [],
    //     maxCount: 1,
    //     add: function (participantA, participantB) {
    //         if (this.maxCount > 0) {
    //             const cId = uniqid();
    //             this.data.push({idA: participantA.id, idB: participantB.id, cId});
    //             this.maxCount--;
    //             return cId;
    //         }
    //
    //         return undefined;
    //     },
    //     remove: function (cId) {
    //         const conversationIndex = this.data.findIndex(c=> c.cId === cId);
    //
    //         if(conversationIndex){
    //             this.data.splice(1, conversationIndex);
    //             return cId;
    //         } else {
    //             return undefined;
    //         }
    //     }
    // };

    io.on('connection', (socket) => {

        console.log('user connected !!!!');

        socket.on('disconnect', function () {

            console.log('user disconnected !!!!');
        });

        socket.on('chat.connect.firstHandshake', function (data) {
            const {token, msg} = data;
            const tokenObject = getObject(token);

            if(tokenObject !== undefined){
                const privateServerKey = rsaWrapper.getPrivateKey('server');

                if(tokenObject.authToken === rsaWrapper.decrypt(privateServerKey, msg)){
                    const aesKey = aesWrapper.generateKey();
                    const publicClientKey = tokenObject.rsaKey;
                    setAESKeyOnObject(token, aesKey);

                    socket.emit('chat.connect.firstHandshake.success', {
                        msg: rsaWrapper.encrypt(publicClientKey, aesKey.toString('base64'))
                    });
                }else {
                    socket.emit('chat.connect.firstHandshake.error');
                }
            } else {
                socket.emit('chat.connect.firstHandshake.error');
            }
        });

        socket.on('chat.connect.secondHandshake', function (data) {
            const {token, msg} = data;
            const tokenObject = getObject(token);

            if(tokenObject !== undefined){
                const aesKey = tokenObject.aesKey;

                if(tokenObject.authToken === aesWrapper.decrypt(aesKey, msg)){
                    socket.emit('chat.connect.secondHandshake.success');
                }else {
                    socket.emit('chat.connect.secondHandshake.error');
                }
            } else {
                socket.emit('chat.connect.secondHandshake.error');
            }
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
            const tokenObject = getObject(token);

            if(tokenObject !== undefined){
                const aesKey = tokenObject.aesKey;

                const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                Participant.get(_data).then(user => {

                    socket.emit('chat.user.info', {
                        msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(user))
                    })
                });
            }
        });

        socket.on('chat.user.contacts', function (data) {
            /**encryptedMsg === {login || id}*/
            const {token, msg} = data;
            const tokenObject = getObject(token);

            if(tokenObject !== undefined){
                const aesKey = tokenObject.aesKey;

                const _data = JSON.parse(aesWrapper.decrypt(aesKey, msg));

                Participant.multiSafeGet({id: _data.userId}).then(contacts => {

                    socket.emit('chat.user.contacts', {
                        msg: aesWrapper.createAesMessage(aesKey, JSON.stringify(contacts))
                    })
                });
            }
        });

        // socket.on('message.sending', function (message) {
        //
        //     const _from = participants.data.find(p => p.id === message.from);
        //     if (_from) {
        //
        //         const _to = participants.data.find(p => p.id === message.to);
        //         if (_to) {
        //             _to.socket.emit('message.incoming', {message: message});
        //         } else {
        //             socket.emit('message.sending.error', {error: 'TO not in participants'});
        //         }
        //     } else {
        //         socket.emit('message.sending.error', {error: 'FROM not in participants'});
        //     }
        // });
        //
        // socket.on('conversation.start', function (participantBId, cId) {
        //
        //     if(!participantBId) {
        //
        //     }
        //     if(cId){
        //         const conversation = conversations.find(c => c.cId === cId);
        //
        //         if(conversation){
        //
        //         } else {
        //
        //         }
        //     } else {
        //         const participantA = participants.find(p => p.socket.id === socket.id);
        //
        //         conversations.add(participantA, participantB)
        //     }
        // })
    });
};

/**
 * Запрос на коннект
 * */