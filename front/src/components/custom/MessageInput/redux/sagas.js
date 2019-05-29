import {select, takeEvery, put, take, fork} from 'redux-saga/effects'
import {TYPES, name} from "./types";
import {TYPES as IA_TYPES} from '../../InputArea/redux/types';
import * as R from "ramda";
import {INIT_STATE_ITEM} from "./reducer";
import {TYPES as CTYPES} from "../../../../common/core";
import {componentName} from '../';

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.INIT_COMPONENT, initiateTask),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.SEND_MSG, sendingMsg)
];

function* inputAreaListenSaga(pcb) {
    const {InputArea} = pcb.children;
    const _IATypes = require(`../../${InputArea.component}/redux/types`).TYPES;

    while (true) {
        const {id} = yield take(_IATypes.CHANGE);

        if (id === InputArea.id) {
            const state = yield select();

            const _object = R.clone(state.Components[InputArea.component][InputArea.id]);

            if (_object.data.length) {
                yield put({type: TYPES.FLAGS, payload: {key: 'mayBeSend', value: true}, id: pcb.id})
            } else {
                yield put({type: TYPES.FLAGS, payload: {key: 'mayBeSend', value: false}, id: pcb.id})
            }
        }
    }
}

function* initiateTask({type, payload, id}) {
    if (payload.hasOwnProperty('pcb'))
        yield fork(inputAreaListenSaga, payload.pcb, id);
}

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

    const _object = R.clone(state.Components.MessageInput[id]);
    const {key, value} = payload;

    if (value !== undefined) {
        _object.flags[key] = value;
    } else {
        _object.flags[key] = !_object.flags[key];
    }

    yield put({type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id});
}

function* sendingMsg({type, pcb, id, from, to}) {
    const {MsgConstructor} = pcb.relations;
    const {InputArea} = pcb.children;
    const _MCTypes = require(`../../${MsgConstructor.component}`).default.types;
    const _IATypes = require(`../../${InputArea.component}`).default.types;

    const state = yield select();
    const data = state.Components[InputArea.component][InputArea.id].data;

    yield put({type: _MCTypes.MSG_MAKING, payload: data, id: MsgConstructor.id});
    yield put({type: _IATypes.CLEAR, id: InputArea.id});
}