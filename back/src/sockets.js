module.exports = function (port) {
    const io = require('socket.io')(port);


    /**data: [{id, socket}]*/
    const participants = {
        data: [],
        maxCount: 2,
        add: function (participant, socket) {
            if (this.maxCount > 0) {
                this.data.push({id: participant.id, socket});
                this.maxCount--;
                console.log(this.maxCount);
                return true;
            }

            return false;
        },
        remove: function (participant) {
            const _participantIndex = this.data.findIndex(p => p.id === participant.id);
            if (_participantIndex >= 0) {
                this.data.splice(_participantIndex,1);
                this.maxCount++;
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

        socket.on('connect to chat', function (participant) {
            const result = participants.add(participant, socket);

            if (result) {
                socket.emit('connect to chat/success', participant);
            } else {
                socket.emit('connect to chat/error', {error: 'No place for you!)'});
            }
        });

        socket.on('incoming message', function (message) {

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
    });
};

/**
 * Запрос на коннект
 * */