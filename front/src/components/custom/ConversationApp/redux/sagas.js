import {take, call, put, select, fork, race, cancelled, takeEvery, delay, all} from 'redux-saga/effects';
import * as R from "ramda";
import axios from 'axios';
import moment from 'moment';
import {TYPES, name} from "./types";
import {TYPES as CTYPES} from '../../../../common/core';
import {INIT_STATE_ITEM} from './reducer';
import {componentName} from '../';
import rsaWrapper from '../../../../common/rsa-wrapper';
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
    const handler = (data) => {
        emit(data);
    };

    function chatConnectionHandlerSuccess(data) {
        console.log(data);
        emit({req: 'chat.connect.success', data});
    }

    function chatConnectionHandlerError(error) {
        console.log(error);
    }

    socket.on('chat.connect.success', chatConnectionHandlerSuccess);
    socket.on('chat.connect.error', chatConnectionHandlerError);
    socket.on('message.incoming', handler);
    socket.on('message.outgoing', handler);
    socket.on('message.sent', handler);
    // socket.on('message.seen', handler);
    return () => {
        socket.off('chat.connect.success', handler);
        socket.off('chat.connect.error', handler);
        socket.off('message.incoming', handler);
        socket.off('message.sending', handler);
        socket.off('message.sent', handler);
        // socket.off('message.seen', handler);
    };
});

// connection monitoring sagas
const listenDisconnectSaga = function* (disconnect, id) {
    while (true) {
        yield call(disconnect);
        yield put({type: TYPES.SERVER_OFF, id});
    }
};

const listenConnectSaga = function* (reconnect, id) {
    while (true) {
        yield call(reconnect);
        yield put({type: TYPES.SERVER_ON, id});
    }
};

const onConnectToChatSaga = function* (socket, _id) {
    while (true) {
        const {id} = yield take(TYPES.CHANNEL_APP_CONNECT);
        const state = yield select();

        if(id === _id){
            const authToken = localStorage.getItem('authToken');

            const serverPublicKey = localStorage.getItem('serverPublicKey');

            rsaWrapper.publicEncrypt(serverPublicKey, 'Hello message').then(msg => {
                socket.emit(
                    `chat.connect.start`,
                    {
                        token: authToken,
                        encryptedMsg: msg
                    }
                );
            });
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

    try {
        yield put({type: TYPES.SERVER_ON, id});
        yield put({type: TYPES.CHANNEL_ON, id});
        const {socket, timeout} = yield race({
            socket: call(connect),
            timeout: delay(2000),
        });

        if (timeout) {
            yield put({type: TYPES.SERVER_OFF, id});
        }
        const socketChannel = yield call(createSocketChannel, socket, id);
        yield fork(listenDisconnectSaga, disconnect, id);
        yield fork(listenConnectSaga, reconnect, id);
        yield fork(onConnectToChatSaga, socket, id);
        yield fork(onSendMessageSaga, socket, id);
        yield fork(onConversationSaga, socket, id);

        yield put({type: TYPES.CHAT_READY, id});

        while (true) {
            const payload = yield take(socketChannel);

            if(payload.req === 'chat.connect.success'){
                yield put({type: TYPES.PARTICIPANT_ID_SET, payload: payload.data, id});
                yield put({type: TYPES.CONNECTION_ON, id});
            }

            // yield put({type: TYPES.RESULT, payload, id});
        }
    } catch (error) {
        console.log(error);
    } finally {
        const action = yield cancelled();
        if (action.id === id) {
            disconnect(true);
            yield put({type: TYPES.CHANNEL_OFF, id});
        }
    }
};

const initServerListeningSaga = function* (action) {
    while (true) {
        yield race({
            task: call(listenServerSaga, action.id),
            cancel: take(TYPES.CHANNEL_STOP),
        });
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

const loginProcess = function* (action) {
    localStorage.setItem('userId', action.userId);
    yield put({type: TYPES.APP_LOGIN_END, id: action.id})
};

const logoutProcess = function* (action) {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('clientPublicKey');
    localStorage.removeItem('clientPrivateKey');
    localStorage.removeItem('serverPublicKey');
    yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
    yield put({type: TYPES.APP_LOGOUT_END, id: action.id});
};

const loginNext = function* (action) {
    yield put({type: TYPES.APP_VIEW_MAIN, id: action.id});
    yield put({type: TYPES.APP_AUTHORIZATION_BEGIN, id: action.id})
};

const userAuthorizationProcess = function* (action) {
    const localToken =  localStorage.getItem('authToken');

    /**Если токен есть то зачем генерировать новый ключ*/
    if(localToken){
        const userId = localStorage.getItem('userId');

        if(!userId){
            yield put({type: TYPES.APP_VIEW_LOGIN, id: action.id});
        } else {
            yield put({type: TYPES.APP_VIEW_MAIN, id: action.id});

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
                yield put({type: TYPES.CHANNEL_START, id: action.id});
            }
        }
    } else {
        const result = yield call(userLogin, action);

        if(!result.hasOwnProperty('error')){
            const {token, id} = result;

            localStorage.setItem('authToken', token);

            yield put({
                type: TYPES.APP_AUTHORIZATION_END,
                id: action.id,
                payload: {authToken: token, userId: id}
            })
        }
    }
};

const userAuthorizationNext = function* (action) {
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
        const keyPair = rsaWrapper.generate();

        localStorage.setItem('clientPublicKey', keyPair.public);
        localStorage.setItem('clientPrivateKey', keyPair.private);

        const serverPublicKey =  yield keyExchange();
        localStorage.setItem('serverPublicKey', rsaWrapper.arrayBufferToBase64String(serverPublicKey.key.data));
    }
   yield put({type: TYPES.CHANNEL_START, id: action.id})
};

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.MESSAGE_MAKING_BEGIN, msgMaker),
    takeEvery(TYPES.CHANNEL_START, initServerListeningSaga),
    takeEvery(TYPES.APP_LOGIN_BEGIN, loginProcess),
    takeEvery(TYPES.APP_LOGIN_END, loginNext),
    takeEvery(TYPES.APP_LOGOUT_BEGIN, logoutProcess),
    takeEvery(TYPES.APP_AUTHORIZATION_BEGIN, userAuthorizationProcess),
    takeEvery(TYPES.APP_AUTHORIZATION_END, userAuthorizationNext)
];

/**
 * 1) Сокета нет.
 * 2) Вытащить токен авторизации с памяти
 * 3) Если есть токен авторизации - попробовать авторизироватся
 * 4) Если нет токена авторизации - получить через Login / Register
 * 5) Получили токен от сервера - аторизируемся и коннектим приложение.
 * */