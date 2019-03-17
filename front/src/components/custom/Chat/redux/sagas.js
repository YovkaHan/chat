import {take, call, put, select, fork, race, cancelled, takeEvery, delay, all} from 'redux-saga/effects';
import * as R from "ramda";
import moment from 'moment';
import {TYPES, name} from "./types";
import {TYPES as CTYPES} from '../../../../common/core';
import {INIT_STATE_ITEM} from './reducer';
import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';

const time = () => moment().unix() * 1000;

const idMake = (index) => name + index;

function* createItemHandle({type, id, coreId}) {
    const state = yield select();
    const index = state.Components.Chat.length;
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

    const _object = R.clone(state.Components.Chat[id]);
    const {key, value} = payload;

    if (value !== undefined) {
        _object.flags[key] = value;
    } else {
        _object.flags[key] = !_object.flags[key];
    }

    yield put({type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id});
}

function* msgMaker({type, payload, pcb, id}) {
    const _time = time();
    const make = pcb.make(id);
    const _payload = {
        from: 'TestFrom',
        to: 'TestTo',
        id: make.config.from + _time + make.config.to,
        msg: payload.join(' '),
        date: _time
    };

    yield put({type: TYPES.MSG_MAKE_COMPLETE, payload: _payload, id});
};

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
        emit({req: 'connect to chat/success', data});
    }

    function chatConnectionHandlerError(error) {
        console.log(error);
    }

    socket.on('connect to chat/success', chatConnectionHandlerSuccess);
    socket.on('connect to chat/error', chatConnectionHandlerError);
    socket.on('message/incoming', handler);
    socket.on('message/outgoing', handler);
    socket.on('message/sent', handler);
    socket.on('message/seen', handler);
    return () => {
        socket.off('connect to chat/success', handler);
        socket.off('connect to chat/error', handler);
        socket.off('message/incoming', handler);
        socket.off('message/outgoing', handler);
        socket.off('message/sent', handler);
        socket.off('message/seen', handler);
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
        const {id} = yield take(TYPES.CHANNEL_CHAT_CONNECT);

        if(id === _id){
            socket.emit(`connect to chat/start`);
        }
    }
};

const onSendMessageSaga = function* (socket, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.CHANNEL_CHAT_SEND);

        if(id === _id){
            socket.emit(
                'message/outgoing',
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

        yield put({type: TYPES.SERVER_ON, id});

        while (true) {
            const payload = yield take(socketChannel);

            if(payload.req === 'connect to chat/success'){
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
    console.log(action);
    while (true) {
        yield race({
            task: call(listenServerSaga, action.id),
            cancel: take(TYPES.CHANNEL_STOP),
        });
    }
};

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.MSG_MAKE, msgMaker),
    takeEvery(TYPES.CHANNEL_START, initServerListeningSaga)
];