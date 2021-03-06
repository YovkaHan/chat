import {
    take,
    call,
    put,
    select,
    fork,
    race,
    cancelled,
    takeEvery,
    delay,
    all,
    actionChannel,
    cancel
} from 'redux-saga/effects';
import * as R from "ramda";
import axios from 'axios';
import {TYPES, name} from "./types";
import {TYPES as CTYPES} from '../../../../common/core';
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';
import rsaWrapper from '../../../../common/rsa-wrapper';
import aesWrapper from '../../../../common/aes-wrapper';
import converterWrapper from '../../../../common/converter-wrapper';
import DB from '../../../../common/db';
import Store from '../../../../common/store';
import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';

const _store = Store();
const idMake = (index) => name + index;
const _DB = DB();
_DB.start();

function ResponseFormat(data) {
    const result = {};
    Object.keys(data).map(key => {
        if (key === 'id')
            result.userId = data[key];
        if (key === 'user')
            result.user = data[key];
        if (key === 'token')
            result.authToken = data[key];
        else {
            result[key] = data[key]
        }
    });
    return result;
}

/**Tests*/
_DB.db().then(async entities => {
    const test = {
        User: false,
        Conversation: false,
        MessageList: false,
        MessageArray: false,
        Message: false,
    };
    if (test.User && entities.User) {
        const user = await entities.User.create({id: 'test', conversations: ['c1', 'c2']});
        console.log('User create ', user);

        const readUser = await entities.User.read({id: 'test'});
        console.log('User read ', readUser);

        const updatedUser = await entities.User.update({id: 'test', test: ['c1', 'c2'], conversations: ['c3']});
        console.log('User update ', updatedUser);

        const deletionResult = await entities.User.delete({id: 'test'});
        console.log('User delete ', deletionResult);
    }
    if (test.Conversation && entities.Conversation) {
        const conversation = await entities.Conversation.create({id: 'test', set: 'multi'});
        console.log('Conversation create ', conversation);

        const readConversation = await entities.Conversation.read({id: 'test'});
        console.log('Conversation read ', readConversation);

        const updatedConversation = await entities.Conversation.update({id: 'test', test: ['c1', 'c2']});
        console.log('Conversation update ', updatedConversation);

        const deletionResult = await entities.Conversation.delete({id: 'test'});
        console.log('Conversation delete ', deletionResult);
    }
    if (test.MessageList && entities.MessageList) {
        const msgL = await entities.MessageList.create();
        console.log('MessageList create ', msgL);

        const readMsgL = await entities.MessageList.read(msgL);
        console.log('MessageList read ', readMsgL);

        const updatedMessageList = await entities.MessageList.addMessage({id: msgL.id, messageId: 'msgID'});
        console.log('MessageList addMessage ', updatedMessageList);

        const deletionResult = await entities.MessageList.delete(msgL);
        console.log('MessageList delete ', deletionResult);
    }
    if (test.MessageArray && entities.MessageArray) {
        const msgA = await entities.MessageArray.create({id: 'test_arr_0', messages: ['testMsg']});
        console.log('MessageArray create ', msgA);

        const readMsgA = await entities.MessageArray.read(msgA);
        console.log('MessageArray read ', readMsgA);

        const updatedMessageArray = await entities.MessageArray.update({id: 'test_arr_0', messages: ['testMsg1']});
        console.log('MessageArray update ', updatedMessageArray);

        const deletionResult = await entities.MessageArray.delete({id: 'test_arr_0'});
        console.log('MessageArray delete ', deletionResult);
    }
    if (test.Message && entities.Message) {
        const message = await entities.Message.create({
            id: 'testMsg',
            data: 'testMsg',
            date: 100000,
            from: 'rerer',
            status: 'sent'
        });
        console.log('Message create ', message);

        const readMessage = await entities.Message.read({id: 'testMsg'});
        console.log('Message read ', readMessage);

        const updatedMessage = await entities.Message.update({id: 'testMsg', status: 'seen'});
        console.log('Message update ', updatedMessage);

        const deletionResult = await entities.Message.delete({id: 'testMsg'});
        console.log('Message delete ', deletionResult);
    }
});

_DB.db().then(async entities => {
    const data = {
        user: {
            '1556984823_a8wjv9okahh': {
                conversations: {
                    'conv1557873362_4f8jvodkrkh': {
                        id: 'conv1557873362_4f8jvodkrkh',
                        name: 'First Conversation',
                        set: 'multi',
                        participants: ['Jordan3D', 'S@eshok'],
                        lastEvent: '1559146929299_aend6EjMdD24hW0IemGp',
                        messages: [{
                            data: 'Hi',
                            date: 1559146927,
                            from: '1556984823_a8wjv9okahh',
                            id: 'AL6NPLK0vLiWszF5ttaS',
                            type: 'sent'
                        }]
                    },
                    'conv1557912754_3vojvp112qi': {
                        id: 'conv1557912754_3vojvp112qi',
                        name: 'Second Conversation',
                        set: 'duo',
                        participants: ['Jordan3D', 'S@eshok'],
                        lastEvent: '1559147013785_D7l2NucnGt6bu7hlPbPf',
                        messages: [{
                            data: 'Hello',
                            date: 1559147012,
                            from: '1555156736_8hcjufg64ce',
                            id: 'ImDnXh85Z6kwO0ItAdPg',
                            to: '1556984823_a8wjv9okahh'
                        }]
                    }
                }
            },
            '1555156736_8hcjufg64ce': {
                conversations: {
                    'conv1557873362_4f8jvodkrkh': {
                        id: 'conv1557873362_4f8jvodkrkh',
                        name: 'First Conversation',
                        set: 'multi',
                        participants: ['Jordan3D', 'S@eshok'],
                        lastEvent: '1559146929781_juxUQKw0RsJ7asiBViTB',
                        messages: []
                    },
                    'conv1557912754_3vojvp112qi': {
                        id: 'conv1557912754_3vojvp112qi',
                        name: 'Second Conversation',
                        set: 'duo',
                        participants: ['Jordan3D', 'S@eshok'],
                        lastEvent: '1559147013367_gDqZu4ZHaTlCBEJaAtMr',
                        messages: []
                    }
                }
            }
        }
    };
    const {User, Conversation, MessageList, Message} = entities;

    await Promise.all(Object.keys(data.user).map(async key => {
        const _u = data.user[key];
        const conversationList = await Promise.all(Object.keys(_u.conversations).map(async c => {
            const conv = _u.conversations[c];
            conv.id += key;
            const conversation = await Conversation.create(conv);
            await Promise.all(Object.keys(conv.messages).map(async m => {
                const message = conv.messages[m];
                await Message.create(message);
                await MessageList.addMessage({id: conversation.messageList, messageId: message.id})
            }));
            return conv.id;
        }));
        return await User.create({id: key, conversations: conversationList});
    }));
});

/**Default Sagas*/
function* createItemHandle({type, id, coreId, payload}) {
    yield put({type: TYPES.LENGTH_PLUS, payload: 1});

    const {callback} = payload;
    const state = yield select();
    const index = state.Components[componentName].length;
    const _id = id ? id : idMake(index);

    if (coreId !== undefined)
        yield put({type: CTYPES.CREATE, payload: _id, id: coreId});

    yield put({type: TYPES.ITEM_CREATE_COMPLETE, payload: R.clone(INIT_STATE_ITEM), id: _id});
    callback();
}

function* deleteItemHandle({type, id}) {
    yield put({type: TYPES.ITEM_DELETE_COMPLETE, id});
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const _object = R.clone(state.Components[componentName][id]);
    const {key, value} = payload;

    if (value !== undefined) {
        _object.flags[key] = value;
    } else {
        _object.flags[key] = !_object.flags[key];
    }

    yield put({type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id});
}

/**CHANNEL*/
// wrapping functions for socket events (connect, disconnect, reconnect)
const socketObject = () => {
    let socket = io(SERVER);

    return {
        connect: () => {
            // socket = io(SERVER);
            return new Promise((resolve) => {
                socket.on('connect', () => {
                    console.log('connect', socket);
                    resolve(socket);
                });
            });
        },
        disconnect: () => {
            //  socket = io(SERVER);
            return new Promise((resolve) => {
                socket.on('disconnect', () => {
                    console.log('disconnect', socket);
                    resolve(socket);
                });
            });
        },
        reconnect: () => {
            // socket = io(SERVER);
            return new Promise((resolve) => {
                socket.on('reconnect', () => {
                    console.log('reconnect', socket);
                    resolve(socket);
                });
            });
        }
    }
};
// This is how channel is created
const createSocketChannel = (socket, authToken, id) => eventChannel((emit) => {
    console.log('CREATE SOCKET');
    const handler = (data) => {
        emit(data);
    };

    function chatConnectionHandlerSuccess(data) {
        emit({req: 'chat.connection.success', data});
    }

    function channelFirstHandShakeHandlerSuccess(data) {
        console.log('First Handshake');
        emit({req: 'chat.connect.firstHandshake.success', data});
    }

    function channelFirstHandShakeHandlerError(error) {
        console.log(error);
    }

    function chatDisconnectHandlerSuccess(data) {
        console.log(data);
        emit({req: 'chat.disconnect.success', data});
    }

    function channelSecondHandshakeHandlerSuccess(data) {
        console.log('Second Handshake');
        emit({req: 'chat.connect.secondHandshake.success', data});
    }

    function userInfoHandler(data, authToken) {
        const aesKey = _store.get(authToken, ['aesKey'])[0];
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'chat.user.info', data: JSON.parse(decryptedData)});
        });
    }

    function userContactsHandler(data, authToken) {
        const aesKey = _store.get(authToken, ['aesKey'])[0];
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'chat.user.contacts', data: JSON.parse(decryptedData)});
        });
    }

    function userConversationsHandler(data, authToken) {
        const aesKey = _store.get(authToken, ['aesKey'])[0];
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'chat.user.conversations', data: JSON.parse(decryptedData)});
        });
    }

    function conversationGetHandler(data, authToken) {
        const aesKey = _store.get(authToken, ['aesKey'])[0];
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'chat.conversation.get', data: JSON.parse(decryptedData)});
        });
    }

    function eventHandler(data, authToken) {
        const aesKey = _store.get(authToken, ['aesKey'])[0];
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'event', data: JSON.parse(decryptedData)});
        });
    }

    function eventManagerArraysHandler(data, authToken) {
        const aesKey = _store.get(authToken, ['aesKey'])[0];
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'event.manager.arrays', data: JSON.parse(decryptedData)});
        });
    }

    socket.on('chat.connection.success', chatConnectionHandlerSuccess);
    socket.on('chat.connect.firstHandshake.success', channelFirstHandShakeHandlerSuccess);
    socket.on('chat.connect.firstHandshake.error', channelFirstHandShakeHandlerError);
    socket.on('chat.connect.secondHandshake.success', channelSecondHandshakeHandlerSuccess);
    socket.on('chat.user.info', (data) => userInfoHandler(data, authToken));
    socket.on('chat.user.contacts', (data) => userContactsHandler(data, authToken));
    socket.on('chat.user.conversations', (data) => userConversationsHandler(data, authToken));
    socket.on('chat.conversation.get', (data) => conversationGetHandler(data, authToken));
    socket.on('message.incoming', handler);
    socket.on('message.outgoing', handler);
    socket.on('message.sent', handler);
    socket.on('event', (data) => eventHandler(data, authToken));
    socket.on('event.manager.arrays', (data) => eventManagerArraysHandler(data, authToken));
    socket.on('chat.disconnect.success', chatDisconnectHandlerSuccess);
    // socket.on('message.seen', handler);
    return () => {
        console.log('DELETE SOCKET');
        socket.removeListener('chat.connection.success', chatConnectionHandlerSuccess);
        socket.removeListener('chat.connect.firstHandshake.success', channelFirstHandShakeHandlerSuccess);
        socket.removeListener('chat.connect.firstHandshake.error', channelFirstHandShakeHandlerError);
        socket.removeListener('chat.connect.secondHandshake.success', channelSecondHandshakeHandlerSuccess);
        socket.removeListener('chat.user.info', userInfoHandler);
        socket.removeListener('chat.user.contacts', userContactsHandler);
        socket.removeListener('chat.user.conversations', userConversationsHandler);
        socket.removeListener('chat.conversation.get', conversationGetHandler);
        socket.removeListener('message.incoming', handler);
        socket.removeListener('message.sending', handler);
        socket.removeListener('message.sent', handler);
        socket.removeListener('event', eventHandler);
        socket.removeListener('event.manager.arrays', eventManagerArraysHandler);
        socket.removeListener('chat.disconnect.success', chatDisconnectHandlerSuccess);
        // socket.off('message.seen', handler);
    };
});

// connection monitoring sagas
const listenDisconnectSaga = function* (disconnect, id) {
    while (true) {
        yield call(disconnect);
        yield put({type: TYPES.APP_SERVER_CONNECTION_OFF, id});
        yield put({type: TYPES.APP_SERVER_OFF, id});
    }
};
const listenConnectSaga = function* (reconnect, id) {
    while (true) {
        yield call(reconnect);
        yield put({type: TYPES.APP_SERVER_CONNECTION_ON, id});
        yield put({type: TYPES.SERVER_ON, id});
    }
};
const tryConnectSaga = function* (socket, _id) {
    while (true) {
        const {id} = yield take(TYPES.APP_SERVER_CONNECTION_TRY);

        if (id === _id) {
            socket.emit('chat.connection');
        }
    }
};
// connection monitoring sagas

const onConnectToChatFinalSaga = function* (socket, authToken, _id) {
    while (true) {
        const {id, data} = yield take(TYPES.CHANNEL_APP_CONNECT_FINAL);
        if (id === _id) {
            const clientPrivateKey = _store.get(authToken, ['clientPrivateKey'])[0];

            rsaWrapper.privateDecrypt(clientPrivateKey, data.msg).then(aesKey => {

                _store.set(authToken, {aesKey}, id);

                aesWrapper.encryptMessage(aesKey, authToken, `chat.connect.secondHandshake`).then(msg => {

                    aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                    socket.emit(
                        `chat.connect.secondHandshake`,
                        {
                            token: authToken,
                            msg
                        }
                    );
                });
            });
        }
    }
};

const onConnectToChatSaga = function* (socket, authToken, _id) {
    while (true) {
        const {id} = yield take(TYPES.CHANNEL_APP_CONNECT);

        if (id === _id) {
            const serverPublicKey = _store.get(authToken, ['serverPublicKey'])[0];

            rsaWrapper.publicEncrypt(serverPublicKey, authToken).then(msg => {
                socket.emit(
                    `chat.connect.firstHandshake`,
                    {
                        token: authToken,
                        msg
                    }
                );
            });
        }
    }
};

const tryDisconnectSaga = function* (socket, authToken, _id) {
    while (true) {
        const {id} = yield take(TYPES.APP_DISCONNECT_TRY);

        if (id === _id) {
            socket.emit(
                `chat.disconnect`,
                {
                    token: authToken,
                }
            );
        }
    }
};

const onUserInfo = function* (socket, authToken, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.APP_USER_INFO);

        if (id === _id) {
            const aesKey = _store.get(authToken, ['aesKey'])[0];

            aesWrapper.encryptMessage(aesKey, JSON.stringify(payload), `chat.user.info`).then(msg => {

                aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                socket.emit(
                    `chat.user.info`,
                    {
                        token: authToken,
                        msg: msg
                    }
                );
            });
        }
    }
};

const onUserContacts = function* (socket, authToken, _id) {
    while (true) {
        const {id} = yield take(TYPES.APP_USER_CONTACTS);

        if (id === _id) {

            const userId = _store.get(authToken, ['userId'])[0];
            const aesKey = _store.get(authToken, ['aesKey'])[0];

            aesWrapper.encryptMessage(aesKey, JSON.stringify({userId}), `chat.user.contacts`).then(msg => {

                aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                socket.emit(
                    `chat.user.contacts`,
                    {
                        token: authToken,
                        msg: msg
                    }
                );
            });
        }
    }
};

const onUserConversations = function* (socket, authToken, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.APP_USER_CONVERSATIONS);

        if (id === _id) {
            const aesKey = _store.get(authToken, ['aesKey'])[0];
            const userId = _store.get(authToken, ['userId'])[0];

            aesWrapper.encryptMessage(aesKey, JSON.stringify({userId}), `chat.user.conversations`).then(msg => {

                aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                socket.emit(
                    `chat.user.conversations`,
                    {
                        token: authToken,
                        msg: msg
                    }
                );
            });
        }
    }
};

const onConversationGet = function* (socket, authToken, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.APP_CONVERSATION_GET);

        if (id === _id) {
            const aesKey = _store.get(authToken, ['aesKey'])[0];

            aesWrapper.encryptMessage(aesKey, JSON.stringify({id: payload.conversationId}), `chat.conversation.get`).then(msg => {

                aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                socket.emit(
                    `chat.conversation.get`,
                    {
                        token: authToken,
                        msg: msg
                    }
                );
            });
        }
    }
};

const onConversationSaga = function* (socket, authToken, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.CHANNEL_CONVERSATION_START);

        if (id === _id) {
            socket.emit(
                'conversation.start',
                {
                    ...payload
                }
            );
        }
    }
};

/**EVENT MANAGER*/
const eventManager = function* (action) {
    console.log('EVENT MANAGER');
    const {id, payload} = action;
    const {pcb} = payload;
    const {Conversation} = pcb.relations;
    const ConversationTypes = require(`../../${Conversation.component}`).default.types;

    while (true) {
        const MSG_MAKING_COMPLETE = yield take(ConversationTypes.MSG_MAKING_COMPLETE);
        const conversationId = MSG_MAKING_COMPLETE.id;
        if (Conversation.id === conversationId) {
            const state = yield select();
            const {date, data} = MSG_MAKING_COMPLETE.payload;
            const participants = state.Components[componentName][id].conversation.data.participants;
            let from = state.Components[componentName][id].user.login;
            let to = undefined;
            if (state.Components[componentName][id].conversation.data.set !== 'multi') {
                if (participants[0] === state.Components[componentName][id].user.login) {
                    to = participants[1];
                } else {
                    to = participants[0];
                }
            }
            const event = {
                data: {
                    message: {
                        data,
                        from,
                        to,
                        date
                    },
                    conversation: {
                        id: state.Components[componentName][id].conversation.data.id
                    },
                },
                name: 'message.new'
            };

            yield put({type: TYPES.EVENT_SEND, id, payload: event});
        }
    }
};

const onEventManagerSaga = function* (socket, authToken, _id) {

    yield fork(eventSend);
    yield fork(eventManagerSync);
    yield fork(eventArraysInterpreter);

    function* eventManagerSync() {
        while (true) {
            const {id, payload} = yield take(TYPES.APP_STAGE_READY);

            if (id === _id) {
                const aesKey = _store.get(authToken, ['aesKey'])[0];
                const userId = _store.get(authToken, ['userId'])[0];

                const lastEventsList = yield call(lastEvents, userId);

                aesWrapper.encryptMessage(aesKey, JSON.stringify({lastEvents: lastEventsList}), 'event.manager.last').then(msg => {

                    aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                    socket.emit(
                        'event.manager.last',
                        {
                            token: authToken,
                            msg
                        }
                    );
                });
            }
        }
    }

    function* eventSend() {
        while (true) {
            const {id, payload} = yield take(TYPES.EVENT_SEND);

            if (id === _id) {
                const aesKey = _store.get(authToken, ['aesKey'])[0];

                aesWrapper.encryptMessage(aesKey, JSON.stringify(payload), 'event').then(msg => {

                    aesWrapper.decryptMessage(aesKey, msg).then(decrypted => console.log('Decrypted:', decrypted));

                    socket.emit(
                        'event',
                        {
                            token: authToken,
                            msg
                        }
                    );
                });
            }
        }
    }

    function* eventArraysInterpreter() {
        while (true) {
            const {id, payload} = yield take(TYPES.APP_EVENT_ARRAYS);

            if (id === _id) {
                const userId = _store.get(authToken, ['userId'])[0];

                //console.log(payload);

                const conversations = yield call(addMessagesToConversation, payload, userId);

                //console.log(conversations);

                for(let i = 0; i < conversations.length; i++){
                    const conversation = conversations[i];

                    if(conversation){
                        yield put({type: TYPES.APP_MESSAGES_NEW, id, payload: conversation});
                    }
                }
            }
        }

        function addMessagesToConversation(conversations, userId) {
            return _DB.db().then(async entities => {
                const {Message, Conversation} = entities;

                return await Promise.all(Object.keys(conversations).map(async id => {
                    const eventList = conversations[id];

                    const messagesMap = await Promise.all(Object.keys(eventList).map(async i => {
                        const message = eventList[i].data.message;
                        message.id = message.id + userId;

                        const m = await Message.create(message);

                        if (!m.hasOwnProperty('error')) {
                            return {
                                message: m,
                                eventId: eventList[i].id
                            };
                        }
                    }));

                    const newMessagesMap = messagesMap.filter(m=>m);

                    if(newMessagesMap.length){
                        await (()=>{
                            return new Promise(resolve => {
                                newMessagesMap.reduce((accumulatorPromise, nextM, index) => {
                                    if(newMessagesMap.length-1 !== index){
                                        return accumulatorPromise.then(async () => {
                                             await Conversation.addMessage({id: id + userId, messageId: nextM.message.id});
                                             return await Conversation.update({id: id + userId, lastEvent: nextM.eventId});
                                        })
                                    } else {
                                        return accumulatorPromise.then(async () => {
                                            await Conversation.addMessage({id: id + userId, messageId: nextM.message.id});
                                            return await Conversation.update({id: id + userId, lastEvent: nextM.eventId});
                                        }).then(()=>resolve())
                                    }
                                }, Promise.resolve());
                            })
                        })();

                        return {
                            conversationId: id,
                            newMessages: newMessagesMap.map(m=>m.message)
                        };
                    }
                }));
            });
        }
    }
};

// Saga to switch on channel.
const listenServerSaga = function* (id) {
    const state = yield select();
    const authToken = state.Components[componentName][id].authToken;
    const _socketObject = socketObject();
    const {connect, disconnect, reconnect} = _socketObject;


    const {socket, timeout} = yield race({
        socket: call(connect),
        timeout: delay(2000),
    });

    if (timeout) {
        yield put({type: TYPES.APP_SERVER_OFF, id});
    } else {
        yield put({type: TYPES.APP_SERVER_ON, id});
    }
    const socketChannel = yield call(createSocketChannel, socket, authToken, id);

    try {

        yield fork(listenDisconnectSaga, disconnect, id);
        yield fork(listenConnectSaga, reconnect, id);
        yield fork(tryConnectSaga, socket, id);
        yield fork(tryDisconnectSaga, socket, authToken, id);
        yield fork(onConnectToChatSaga, socket, authToken, id);
        yield fork(onConversationSaga, socket, authToken, id);
        yield fork(onConnectToChatFinalSaga, socket, authToken, id);

        yield fork(onUserInfo, socket, authToken, id);
        yield fork(onUserContacts, socket, authToken, id);
        yield fork(onUserConversations, socket, authToken, id);
        yield fork(onConversationGet, socket, authToken, id);

        yield fork(onEventManagerSaga, socket, authToken, id);

        while (true) {
            const payload = yield take(socketChannel);

            //console.log(`${payload.req} ${id}`);

            if (payload.req === 'chat.connection.success') {
                yield put({type: TYPES.APP_SERVER_CONNECTION_ON, id});
            } else if (payload.req === 'chat.connect.firstHandshake.success') {
                yield put({type: TYPES.CHANNEL_APP_CONNECT_FINAL, id, data: payload.data});
            } else if (payload.req === 'chat.connect.secondHandshake.success') {
                yield put({type: TYPES.APP_CHANNEL_ON, id});
                yield put({type: TYPES.APP_STAGE_READY, id, payload: {authToken}});
            } else if (payload.req === 'chat.disconnect.success') {
                yield put({type: TYPES.APP_DISCONNECT_ALLOW, id});
            } else if (payload.req === 'chat.user.info') {
                if (payload.data.error) {
                    console.error(payload.data.error);
                } else {
                    yield put({type: TYPES.APP_USER_INFO_COMPLETE, payload: payload.data, id});
                    yield put({type: TYPES.APP_USER_CONTACTS, id});
                    yield put({type: TYPES.APP_USER_CONVERSATIONS, id});
                }
            } else if (payload.req === 'chat.user.contacts') {
                if (payload.data.error) {
                    console.error(payload.data.error);
                } else {
                    yield put({type: TYPES.APP_USER_CONTACTS_COMPLETE, payload: payload.data, id});
                }
            } else if (payload.req === 'chat.user.conversations') {
                //console.log(`chat.user.conversations ${id}`);
                if (payload.data.error) {
                    console.error(payload.data.error);
                } else {
                    yield put({type: TYPES.APP_USER_CONVERSATIONS_COMPLETE, payload: payload.data, id});
                }
            } else if (payload.req === 'chat.conversation.get') {
                if (payload.data.error) {
                    console.error(payload.data.error);
                } else {
                    yield put({type: TYPES.APP_CONVERSATION_GET_COMPLETE, payload: payload.data, id, authToken});
                }
            } else if (payload.req === 'event.manager.arrays') {
                if (payload.data.error) {
                    console.error(payload.data.error);
                } else {
                    yield put({type: TYPES.APP_EVENT_ARRAYS, payload: payload.data, id});
                }
            }
        }
    } catch (error) {
        console.log(error);
    } finally {
        if (yield cancelled()) {
            console.log('END');
            disconnect(true);
            socketChannel.close();
            yield put({type: TYPES.APP_CHANNEL_OFF, id});
        }
    }
};

const initServerListeningSaga = function* (action) {
    yield put({type: TYPES.APP_STAGE_PREPARED, id: action.id});

    while (true) {
        const task = yield fork(listenServerSaga, action.id);
        const serverDestroy = yield take(TYPES.APP_SERVER_DESTROY);

        if (serverDestroy.id === action.id) {
            yield cancel(task);
            break;
        }
    }
};

const userLogin = (id, userId) => {
    if (!userId) {
        return new Promise(resolve => {
            put({type: TYPES.APP_VIEW_LOGIN, id});
            resolve({error: {}});
        })
    } else {
        return axios.post(`${SERVER}/participant/login`, {
            id: userId
        }).then(function (response) {
            console.log(response);
            return ResponseFormat(response.data);
        }).catch(error => {
            console.error(error);
            return error;
        })
    }
};
const authTokenCheck = (props) => {
    const {authToken, userId} = props;

    return axios.post(`${SERVER}/authToken/check`, {
        token: authToken,
        id: userId
    }).then(function (response) {
        console.log(response);
        return ResponseFormat(response.data);
    }).catch(error => {
        console.error(error);
        return error;
    })
};
const keyExchange = (authToken) => {
    const userId = _store.get(authToken, ['userId'])[0];
    const key = _store.get(authToken, ['clientPublicKey'])[0];

    return axios.post(`${SERVER}/authToken/key`, {
        token: authToken,
        id: userId,
        key
    }).then(function (response) {
        console.log(response);
        return ResponseFormat(response.data);
    }).catch(error => {
        console.error(error);
        return error;
    })
};
const userLogout = (authToken) => {
    const userId = _store.get(authToken, ['userId'])[0];

    return axios.post(`${SERVER}/participant/logout`, {
        token: authToken,
        id: userId
    }).then(function (response) {
        console.log(response);
        return ResponseFormat(response.data);
    }).catch(error => {
        console.error(error);
        return error;
    })
};
const lastEvents = (userId) => {
    return _DB.db().then(async entities => {
        const {User, Conversation} = entities;
        const user = await User.read({id: userId});
        const result = {};

        await Promise.all(user.conversations.map(async cId => {
            const conversation = await Conversation.read({id: cId});
            const trueConversationId = cId.slice(0, cId.indexOf(userId));

            result[trueConversationId] = conversation.lastEvent
        }));

        return result;
    });
};

/**LOGIN*/
const loginProcess = function* (action) {
    //localStorage.setItem('userId', action.userId);
    const {id} = action;
    const {userId} = action.payload;
    const loginResult = yield call(userLogin, id, userId);

    if (loginResult.hasOwnProperty('error')) {
        //localStorage.removeItem('userId');
        yield put({type: TYPES.APP_LOGIN_ERROR, id: action.id})
    } else {
        const {authToken} = loginResult;

        // localStorage.setItem('authToken', authToken);
        yield put({
            type: TYPES.APP_LOGIN_END,
            id: action.id,
            payload: {userId, authToken}
        })
    }
};
const loginNext = function* (action) {
    yield put({
        type: TYPES.APP_AUTHORIZATION_BEGIN,
        id: action.id,
        payload: R.clone(action.payload)
    })
};

/**LOGOUT*/
const logoutProcess = function* (action) {
    yield put({type: TYPES.APP_STAGE_DESTROY, id: action.id});
    yield put({type: TYPES.APP_DISCONNECT_TRY, id: action.id});
    yield take(TYPES.APP_DISCONNECT_ALLOW);

    yield put({type: TYPES.APP_SERVER_OFF, id: action.id});

    const state = yield select();
    const authToken = state.Components[componentName][action.id].authToken;

    const logoutResult = yield call(userLogout, authToken);

    if (logoutResult.authToken === authToken) {
        _store.del(authToken);
        yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
        yield put({type: TYPES.APP_LOGOUT_END, id: action.id});
    }
};
const afterLogout = function* (action) {
    yield put({type: TYPES.APP_SERVER_DESTROY, id: action.id});
    yield put({type: TYPES.APP_CLEAR, id: action.id});
};

/**TOKEN CHECK*/
const userAuthorizationProcess = function* (action) {
    const {authToken, userId} = action.payload;

    /**Если токен есть то зачем генерировать новый ключ*/
    if (authToken) {

        if (!userId) {
            yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
        } else {
            const checkResult = yield call(authTokenCheck, action.payload);

            if (checkResult.error) {
                console.error(checkResult.error);
                yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
            } else {
                _store.set(authToken, {userId}, action.id);
                yield put({
                    type: TYPES.APP_AUTHORIZATION_END,
                    id: action.id,
                    payload: R.clone(action.payload)
                });
            }
        }
    } else {
        const localAuthToken = _store.getTokenById(action.id);
        if (localAuthToken) {
            const localUserId = _store.get(localAuthToken, ['userId'])[0];
            yield put({
                type: TYPES.APP_AUTHORIZATION_BEGIN,
                id: action.id,
                payload: {authToken: localAuthToken, userId: localUserId}
            });
        } else {
            yield put({type: TYPES.APP_LOGIN_BEGIN, id: action.id, payload: {userId}});
        }
    }
};

/**TOKEN RECHECK and END OF AUTHORIZATION*/
const userAuthorizationNext = function* (action) {

    if (action.payload) {
        const keyPair = yield call(rsaWrapper.generate);

        const authToken = action.payload.authToken;

        _store.set(authToken, {
            clientPublicKey: keyPair.privateKey,
            clientPrivateKey: keyPair.privateKey
        }, action.id);

        const serverPublicKey = yield keyExchange(authToken);

        _store.set(authToken, {
            serverPublicKey: atob(serverPublicKey.key)
        }, action.id);

        yield put({type: TYPES.APP_VIEW_MAIN, id: action.id});
        yield put({type: TYPES.APP_SERVER_PREPARE, id: action.id})
    } else {
        const state = yield select();
        const authToken = state.Components[componentName][action.id].authToken;
        const data = _store.set(authToken, ['userId'], action.id);
        const userId = data.length ? data[0] : undefined;
        const checkResult = yield call(authTokenCheck, {authToken, userId});

        if (checkResult.error) {
            const loginResult = yield call(userLogin, action);

            if (!loginResult.hasOwnProperty('error')) {
                const {authToken, id} = loginResult;

                _store.set(authToken, {
                    userId: id
                }, action.id);

                yield put({
                    type: TYPES.APP_AUTHORIZATION_END,
                    id: action.id,
                    payload: {authToken, userId: id}
                })
            }
        } else {
            const keyPair = yield call(rsaWrapper.generate);

            _store.set(authToken, {
                clientPublicKey: keyPair.privateKey,
                clientPrivateKey: keyPair.privateKey
            }, action.id);

            const serverPublicKey = yield keyExchange(authToken);

            _store.set(authToken, {
                serverPublicKey: atob(serverPublicKey.key)
            }, action.id);

            yield put({type: TYPES.APP_VIEW_MAIN, id: action.id});
            yield put({type: TYPES.APP_SERVER_PREPARE, id: action.id})
        }
    }
};

const afterStageReady = function* (action) {
    const {authToken} = action.payload;
    const payload = {
        id: _store.get(authToken, ['userId'])[0]
    };

    yield put({type: TYPES.APP_USER_INFO, id: action.id, payload})
};

const conversationFormation = function* (action) {
    const {authToken, payload} = action;
    const userId = _store.get(authToken, ['userId'])[0];

    const conversation = yield call(getMessagesByConversationId, payload.id, userId);

    yield put({type: TYPES.APP_CONVERSATION_MESSAGES_SET, id: action.id, payload: conversation});
};

const getMessagesByConversationId = (cId, userId) => {
    return _DB.db().then(async entities => {
        const {Conversation} = entities;
        return await Conversation.getMessages({id: cId + userId});
    });
};

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.APP_SERVER_PREPARE, initServerListeningSaga),
    takeEvery(TYPES.APP_LOGIN_BEGIN, loginProcess),
    takeEvery(TYPES.APP_LOGIN_END, loginNext),
    takeEvery(TYPES.APP_LOGOUT_BEGIN, logoutProcess),
    takeEvery(TYPES.APP_AUTHORIZATION_BEGIN, userAuthorizationProcess),
    takeEvery(TYPES.APP_AUTHORIZATION_END, userAuthorizationNext),
    takeEvery(TYPES.APP_STAGE_READY, afterStageReady),
    takeEvery(TYPES.APP_LOGOUT_END, afterLogout),
    takeEvery(TYPES.APP_EVENT_MANAGER, eventManager),
    takeEvery(TYPES.APP_CONVERSATION_GET_COMPLETE, conversationFormation)
];

/**
 * 1) Сокета нет.
 * 2) Вытащить токен авторизации с памяти
 * 3) Если есть токен авторизации - попробовать авторизироватся
 * 4) Если нет токена авторизации - получить через Login / Register
 * 5) Получили токен от сервера - аторизируемся и коннектим приложение.
 * */