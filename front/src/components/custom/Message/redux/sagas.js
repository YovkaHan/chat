import {select, takeEvery, put} from 'redux-saga/effects'
import {TYPES, name} from "./types";
import * as R from "ramda";
import {INIT_STATE_ITEM} from './reducer';

export const idMake = (index) => name+index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
];

function* createItemHandle({type}) {
    const state = yield select();
    const index = state.Components.Message.length;

    return yield put({ type: TYPES.ITEM_CREATE_COMPLETE, payload: R.clone(INIT_STATE_ITEM), id: idMake(index)});
}

function* deleteItemHandle({type, id}) {
    yield put({ type: TYPES.ITEM_DELETE_COMPLETE, id });
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const _object = R.clone(state.Components.Button[id]);
    const {key, value} = payload;

    if(value !== undefined){
        _object.flags[key] = value;
    }else{
        _object.flags[key] = !_object.flags[key];
    }

    yield put({ type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id });
}