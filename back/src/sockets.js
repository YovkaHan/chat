module.exports = function (port) {
    const io = require('socket.io')(port);
    const uniqid = require('uniqid');


    /**data: [{id, socket}]*/
    const participants = {
        data: [],
        maxCount: 2,
        add: function (socket) {
            if (this.maxCount > 0) {
                const cId = uniqid();
                this.data.push({id: cId, socket});
                this.maxCount--;
                return cId;
            }

            return undefined;
        },
        remove: function (participant) {
            const _participantIndex = this.data.findIndex(p => p.id === participant.id);
            if (_participantIndex >= 0) {
                this.data.splice(_participantIndex,1);
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
            const conversationIndex = this.data.findIndex(c=> c.cId === cId);

            if(conversationIndex){
                this.data.splice(1, conversationIndex);
                return cId;
            } else {
                return undefined;
            }
        }
    };

    io.on('connection', (socket) => {

        console.log('user connected !!!!');

        socket.on('disconnect', function () {

            const _participant = participants.data.find(p => p.socket && p.socket.id === socket.id);

            if (_participant)
                participants.remove(_participant);

            console.log('user disconnected !!!!');
        });

        socket.on('chat.connect.start', function (participant) {
            console.log('add participant');

            if(participant){
                const addedParticipant = participants.data.find(p => p.id === participant);

                if(addedParticipant){
                    addedParticipant.socket = socket;
                }else {
                    socket.emit('chat.connect.error', {error: 'Some mistake happened'});
                }
            } else {
                const result = participants.add(socket);

                if (result) {
                    socket.emit('chat.connect.success', result);
                } else {
                    socket.emit('chat.connect.error', {error: 'No place for you!)'});
                }
            }
        });

        socket.on('message.sending', function (message) {

            const _from = participants.data.find(p => p.id === message.from);
            if (_from) {

                const _to = participants.data.find(p => p.id === message.to);
                if (_to) {
                    _to.socket.emit('message.incoming', {message: message});
                } else {
                    socket.emit('message.sending.error', {error: 'TO not in participants'});
                }
            } else {
                socket.emit('message.sending.error', {error: 'FROM not in participants'});
            }
        });

        socket.on('conversation.start', function (participantBId, cId) {

            if(!participantBId) {

            }
            if(cId){
                const conversation = conversations.find(c => c.cId === cId);

                if(conversation){

                } else {

                }
            } else {
                const participantA = participants.find(p => p.socket.id === socket.id);

                conversations.add(participantA, participantB)
            }
        })
    });
};

/**
 * Запрос на коннект
 * */