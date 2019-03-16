import {select, takeEvery, put} from 'redux-saga/effects'
import * as R from "ramda";
import moment from 'moment';
import {TYPES, name} from "./types";
import {TYPES as CTYPES} from '../../../../common/core';
import {INIT_STATE_ITEM} from './reducer';

const time = () => moment().unix() * 1000;

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.MSG_MAKE, msgMaker)
];

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
        msg: payload.join(''),
        date: _time
    };

    yield put({type: TYPES.MSG_MAKE_COMPLETE, payload: _payload, id});
}