import {take, call, put, select, fork, race, cancelled, takeEvery, delay, all, actionChannel, cancel} from 'redux-saga/effects';
import * as R from "ramda";
import axios from 'axios';
import moment from 'moment';
import {TYPES, name} from "./types";
import {TYPES as CTYPES} from '../../../../common/core';
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';
import rsaWrapper from '../../../../common/rsa-wrapper';
import aesWrapper from '../../../../common/aes-wrapper';
import converterWrapper from '../../../../common/converter-wrapper';
import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';

const time = () => moment().unix() * 1000;
const idMake = (index) => name + index;

function* createItemHandle({type, id, coreId}) {
    const state = yield select();
    const index = state.Components[componentName].length;
    const _id = id ? id : idMake(index);

    if (coreId !== undefined)
        yield put({type: CTYPES.CREATE, payload:_id, id: coreId});

    yield put({type: TYPES.ITEM_CREATE_COMPLETE, payload: R.clone(INIT_STATE_ITEM), id: _id});
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

function* msgMaker({type, payload, pcb, id, from, to, cId}) {
    const _time = time();
    const _payload = {
        from: 'TestFrom',
        to: 'TestTo',
        cId,
        id: from + _time + to,
        msg: payload.join(' '),
        date: _time
    };

    yield put({type: TYPES.MESSAGE_MAKING_FINISHED, payload: _payload, id});
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
const createSocketChannel = (socket, id) => eventChannel((emit) => {
    console.log('CREATE SOCKET');
    const handler = (data) => {
        emit(data);
    };

    function chatConnectionHandlerSuccess(data) {
        emit({req: 'chat.connection.success', data});
    }

    function channelFirstHandShakeHandlerSuccess(data) {
        console.log(data);
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
        console.log(data);
        emit({req: 'chat.connect.secondHandshake.success', data});
    }

    function userInfoHandler(data) {
        const aesKey = localStorage.getItem('aesKey');
        aesWrapper.decryptMessage(aesKey, data.msg).then(decryptedData => {
            emit({req: 'chat.user.info', data: JSON.parse(decryptedData)});
        });
    }

    socket.on('chat.connection.success', chatConnectionHandlerSuccess);
    socket.on('chat.connect.firstHandshake.success', channelFirstHandShakeHandlerSuccess);
    socket.on('chat.connect.firstHandshake.error', channelFirstHandShakeHandlerError);
    socket.on('chat.connect.secondHandshake.success', channelSecondHandshakeHandlerSuccess);
    socket.on('chat.user.info', userInfoHandler);
    socket.on('message.incoming', handler);
    socket.on('message.outgoing', handler);
    socket.on('message.sent', handler);
    socket.on('chat.disconnect.success', chatDisconnectHandlerSuccess);
    // socket.on('message.seen', handler);
    return () => {
        console.log('DELETE SOCKET');
        socket.removeListener('chat.connection.success', chatConnectionHandlerSuccess);
        socket.removeListener('chat.connect.firstHandshake.success', channelFirstHandShakeHandlerSuccess);
        socket.removeListener('chat.connect.firstHandshake.error', channelFirstHandShakeHandlerError);
        socket.removeListener('chat.connect.secondHandshake.success', channelSecondHandshakeHandlerSuccess);
        socket.removeListener('chat.user.info', userInfoHandler);
        socket.removeListener('message.incoming', handler);
        socket.removeListener('message.sending', handler);
        socket.removeListener('message.sent', handler);
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

        if(id === _id){
            socket.emit('chat.connection');
        }
    }
};
// connection monitoring sagas

const onConnectToChatFinalSaga = function* (socket, _id) {
    while (true) {
        const {id, data} = yield take(TYPES.CHANNEL_APP_CONNECT_FINAL);
        if(id === _id){
            const authToken = localStorage.getItem('authToken');
            const clientPrivateKey = localStorage.getItem('clientPrivateKey');

            rsaWrapper.privateDecrypt(clientPrivateKey, data.msg).then(aesKey => {

                localStorage.setItem('aesKey', aesKey);

                aesWrapper.encryptMessage(aesKey, authToken).then(msg => {
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

const onConnectToChatSaga = function* (socket, _id) {
    while (true) {
        const {id} = yield take(TYPES.CHANNEL_APP_CONNECT);

        if(id === _id){
            const authToken = localStorage.getItem('authToken');

            const serverPublicKey = localStorage.getItem('serverPublicKey');

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
const tryDisconnectSaga = function* (socket, _id) {
    while (true) {
        const {id} = yield take(TYPES.APP_DISCONNECT_TRY);

        if(id === _id){
            const authToken = localStorage.getItem('authToken');

            socket.emit(
                `chat.disconnect`,
                {
                    token: authToken,
                }
            );
        }
    }
};
const onSendMessageSaga = function* (socket, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.CHANNEL_CHAT_SEND);

        if(id === _id){
            socket.emit(
                'message.sending',
                {
                    ...payload
                }
            );
        }
    }
};

const onUserInfo = function* (socket, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.APP_USER_INFO);

        if(id === _id){
            const authToken = localStorage.getItem('authToken');

            const aesKey = localStorage.getItem('aesKey');

            aesWrapper.encryptMessage(aesKey, JSON.stringify(payload)).then(msg => {
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

const onConversationSaga = function* (socket, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.CHANNEL_CONVERSATION_START);

        if(id === _id){
            socket.emit(
                'conversation.start',
                {
                    ...payload
                }
            );
        }
    }
};

// Saga to switch on channel.
const listenServerSaga = function* (id) {
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
        const socketChannel = yield call(createSocketChannel, socket, id);

    try {

        yield fork(listenDisconnectSaga, disconnect, id);
        yield fork(listenConnectSaga, reconnect, id);
        yield fork(tryConnectSaga, socket, id);
        yield fork(tryDisconnectSaga, socket, id);
        yield fork(onConnectToChatSaga, socket, id);
        yield fork(onSendMessageSaga, socket, id);
        yield fork(onConversationSaga, socket, id);
        yield fork(onConnectToChatFinalSaga, socket, id);

        yield fork(onUserInfo, socket, id);

        while (true) {
            const payload = yield take(socketChannel);

            if(payload.req === 'chat.connection.success'){
                yield put({type: TYPES.APP_SERVER_CONNECTION_ON, id});
            } else if(payload.req === 'chat.connect.firstHandshake.success'){
                yield put({type: TYPES.CHANNEL_APP_CONNECT_FINAL, id, data: payload.data});
            } else if(payload.req === 'chat.connect.secondHandshake.success'){
                yield put({type: TYPES.APP_CHANNEL_ON, id});
                yield put({type: TYPES.APP_STAGE_READY, id});
            }else if(payload.req === 'chat.disconnect.success'){
                yield put({type: TYPES.APP_DISCONNECT_ALLOW, id});
            } else if(payload.req === 'chat.user.info'){
                if(payload.data.error){

                } else {
                    yield put({type: TYPES.APP_USER_INFO_COMPLETE, payload: payload.data, id});
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

        if(serverDestroy.id === action.id){
            yield cancel(task);
            break;
        }
    }
};

const userLogin = (action) => {
    const userId = localStorage.getItem('userId');
    if(!userId){
        return new Promise(resolve => {
            put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
            resolve({error: {}});
        })
    } else {
        return axios.post(`${SERVER}/participant/login`, {
            name: 'Fred',
            id: userId
        }).then(function (response) {
            console.log(response);
            return response.data;
        }).catch(error => {
            console.error(error);
            return error;
        })
    }
};
const tokenCheck = () => {
    const userId = localStorage.getItem('userId');
    const authToken =  localStorage.getItem('authToken');

    return axios.post(`${SERVER}/token/check`, {
        token: authToken,
        userId
    }).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    })
};
const keyExchange = () => {
    const userId = localStorage.getItem('userId');
    const authToken =  localStorage.getItem('authToken');
    const key = localStorage.getItem('clientPublicKey');

    return axios.post(`${SERVER}/token/key`, {
        token: authToken,
        userId,
        key
    }).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    })
};
const userLogout = () => {
    const userId = localStorage.getItem('userId');
    const authToken =  localStorage.getItem('authToken');

    return axios.post(`${SERVER}/participant/logout`, {
        token: authToken,
        userId
    }).then(function (response) {
        console.log(response);
        return response.data;
    }).catch(error => {
        console.error(error);
        return error;
    })
};

/**LOGIN*/
const loginProcess = function* (action) {
    localStorage.setItem('userId', action.userId);
    const loginResult = yield call(userLogin, action);

    if(loginResult.hasOwnProperty('error')){
        localStorage.removeItem('userId');
        yield put({type: TYPES.APP_LOGIN_ERROR, id: action.id})
    } else {
        const {token} = loginResult;

        localStorage.setItem('authToken', token);
        yield put({type: TYPES.APP_LOGIN_END, id: action.id})
    }
};
const loginNext = function* (action) {
    yield put({type: TYPES.APP_AUTHORIZATION_BEGIN, id: action.id})
};

/**LOGOUT*/
const logoutProcess = function* (action) {
    yield put({type: TYPES.APP_STAGE_DESTROY, id: action.id});
    yield put({type: TYPES.APP_DISCONNECT_TRY, id: action.id});
    yield take(TYPES.APP_DISCONNECT_ALLOW);

    yield put({type: TYPES.APP_SERVER_OFF, id: action.id});

    const logoutResult = yield call(userLogout);

    if(logoutResult.token === localStorage.getItem('authToken')){
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        localStorage.removeItem('clientPublicKey');
        localStorage.removeItem('clientPrivateKey');
        localStorage.removeItem('serverPublicKey');
        yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
        yield put({type: TYPES.APP_LOGOUT_END, id: action.id});
    }
};
const afterLogout = function* (action) {
    yield put({type: TYPES.APP_SERVER_DESTROY, id: action.id});
};

/**TOKEN CHECK*/
const userAuthorizationProcess = function* (action) {
    const localToken =  localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');

    /**Если токен есть то зачем генерировать новый ключ*/
    if(localToken){

        if(!userId){
            yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
        } else {
            const checkResult = yield call(tokenCheck);

            if(checkResult.error) {
                console.error(checkResult.error);
                yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
            } else {
                yield put({
                    type: TYPES.APP_AUTHORIZATION_END,
                    id: action.id,
                    payload: {authToken: localToken, userId}
                });
            }
        }
    } else {
        yield put({type: TYPES.APP_LOGIN_BEGIN, id: action.id, userId});
    }
};

/**TOKEN RECHECK and END OF AUTHORIZATION*/
const userAuthorizationNext = function* (action) {

    if(action.payload){
        const keyPair = yield call(rsaWrapper.generate);

        localStorage.setItem('clientPublicKey', keyPair.privateKey);
        localStorage.setItem('clientPrivateKey', keyPair.privateKey);

        const serverPublicKey =  yield keyExchange();
        localStorage.setItem('serverPublicKey', atob(serverPublicKey.key));

        yield put({type: TYPES.APP_VIEW_MAIN, id: action.id});
        yield put({type: TYPES.APP_SERVER_PREPARE, id: action.id})
    } else {
        const checkResult = yield call(tokenCheck);

        if(checkResult.error) {
            const loginResult = yield call(userLogin, action);

            if(!loginResult.hasOwnProperty('error')){
                const {token, id} = loginResult;

                localStorage.setItem('authToken', token);

                yield put({
                    type: TYPES.APP_AUTHORIZATION_END,
                    id: action.id,
                    payload: {authToken: token, userId: id}
                })
            }
        } else {
            const keyPair = yield call(rsaWrapper.generate);

            localStorage.setItem('clientPublicKey', keyPair.privateKey);
            localStorage.setItem('clientPrivateKey', keyPair.privateKey);

            const serverPublicKey =  yield keyExchange();
            localStorage.setItem('serverPublicKey', atob(serverPublicKey.key));

            yield put({type: TYPES.APP_VIEW_MAIN, id: action.id});
            yield put({type: TYPES.APP_SERVER_PREPARE, id: action.id})
        }
    }
};

const afterStageReady = function* (action) {
    const payload = {
      id: localStorage.getItem('userId')
    };

    yield put({type: TYPES.APP_USER_INFO, id: action.id, payload})
};

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.MESSAGE_MAKING_BEGIN, msgMaker),
    takeEvery(TYPES.APP_SERVER_PREPARE, initServerListeningSaga),
    takeEvery(TYPES.APP_LOGIN_BEGIN, loginProcess),
    takeEvery(TYPES.APP_LOGIN_END, loginNext),
    takeEvery(TYPES.APP_LOGOUT_BEGIN, logoutProcess),
    takeEvery(TYPES.APP_AUTHORIZATION_BEGIN, userAuthorizationProcess),
    takeEvery(TYPES.APP_AUTHORIZATION_END, userAuthorizationNext),
    takeEvery(TYPES.APP_STAGE_READY, afterStageReady),
    takeEvery(TYPES.APP_LOGOUT_END, afterLogout)
];

/**
 * 1) Сокета нет.
 * 2) Вытащить токен авторизации с памяти
 * 3) Если есть токен авторизации - попробовать авторизироватся
 * 4) Если нет токена авторизации - получить через Login / Register
 * 5) Получили токен от сервера - аторизируемся и коннектим приложение.
 * */