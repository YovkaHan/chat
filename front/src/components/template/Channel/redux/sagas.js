import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';
import {take, call, put, fork, race, cancelled, takeEvery, delay, all} from 'redux-saga/effects';
import {createSelector} from 'reselect';
import {TYPES} from "./types";
import * as R from "ramda";


// sorting function to show the latest tasks.json first
const sortTasks = (task1, task2) => task2.taskID - task1.taskID;

// selector to get only first 5 latest tasks.json
const taskSelector = state => state.taskReducer.taskList;
const topTask = allTasks => allTasks.sort(sortTasks).slice(0, 5);
export const topTaskSelector = createSelector(taskSelector, topTask);

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
    socket.on('connect to chat/success', handler);
    socket.on('connect to chat/error', handler);
    socket.on('incoming message', handler);
    socket.on('incoming message/error', handler);
    return () => {
        socket.off('connect to chat/success', handler);
        socket.off('connect to chat/error', handler);
        socket.off('incoming message', handler);
        socket.off('incoming message/error', handler);
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
            socket.emit(`connect to chat`, {id: id});
        }
    }
};

const onSendMessageSaga = function* (socket, _id) {
    while (true) {
        const {id, payload} = yield take(TYPES.CHANNEL_CHAT_SEND);

        if(id === _id){
            socket.emit(
                `incoming message`,
                {
                    from: payload.from,
                    message:['Hello'],
                    to: payload.to
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

        yield put({type: TYPES.SERVER_ON, id});

        yield fork(onConnectToChatSaga, socket, id);
        yield fork(onSendMessageSaga, socket, id);

        while (true) {
            const payload = yield take(socketChannel);
            yield put({type: TYPES.RESULT, payload, id});
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

// saga listens for start and stop actions
export default function* (id) {
    while (true) {
        const action = yield take(TYPES.CHANNEL_START);
        if (action.id === id) {
            yield race({
                task: call(listenServerSaga, action.id),
                cancel: take(TYPES.CHANNEL_STOP),
            });
        }
    }
};