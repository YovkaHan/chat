module.exports = function (server) {
    const {participants, conversations} = require('../server');
    const io = require('socket.io').listen(server);
    const uniqid = require('uniqid');

    io.on('connection', (socket) => {

        console.log('user connected !!!!');

        socket.on('disconnect', function () {

            const _participant = participants.data.find(p => p.socket && p.socket.id === socket.id);

            if (_participant)
                participants.remove(_participant);

            console.log('user disconnected !!!!');
        });

        socket.on('connect to chat/start', function (participant) {
            console.log('add participant');

            if (participant.id) {
                const addedParticipant = participants.data.find(p => p.id === participant.id);

                if (addedParticipant) {
                    addedParticipant.socket = socket;
                } else {
                    socket.emit('connect to chat/error', {error: 'Some mistake happened'});
                }
            } else {
                const result = participants.add(socket, participant.name);

                if (result) {
                    socket.emit('connect to chat/success', result);
                } else {
                    socket.emit('connect to chat/error', {error: 'No place for you!)'});
                }
            }
        });

        socket.on('message/incoming', function (message) {

            const _from = participants.data.find(p => p.id === message.from);
            if (_from) {

                const _to = participants.data.find(p => p.id === message.to);
                if (_to) {
                    _to.socket.emit('incoming message', {message: message});
                } else {
                    socket.emit('incoming message/error', {error: 'TO not in participants'});
                }
            } else {
                socket.emit('incoming message/error', {error: 'FROM not in participants'});
            }
        });

        socket.on('conversation/start', function (participantBId, cId) {

            if (!participantBId) {

            }
            /** conversation check*/
            if (cId) {
                const conversation = conversations.data.find(c => c.cId === cId);

                if (conversation) {
                    socket.emit('conversation/success', conversation.id);
                } else {
                    socket.emit('conversation/error');
                }
            } else {
                const participantAId = participants.data.find(p => p.socket.id === socket.id).id;

                const conversationId = conversations.add(participantAId, participantBId);
                socket.emit('conversation/success', conversationId);
            }
        })
    });
};

/**
 * Запрос на коннект
 * */