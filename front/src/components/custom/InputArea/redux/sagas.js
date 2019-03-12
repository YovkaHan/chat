import {select, takeEvery, put} from 'redux-saga/effects'
import * as R from "ramda";
import {TYPES, name} from "./types";
import {TYPES as CTYPES} from "../../../../common/core";
import {INIT_STATE_ITEM} from "./reducer";

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle)
];

function* createItemHandle({type, id, coreId}) {
    const state = yield select();
    const index = state.Components.InputArea.length;
    const _id = id ? id : idMake(index);

    console.log(_id);

    if (coreId !== undefined)
        yield put({type: CTYPES.CREATE, payload:_id, id: coreId});

    yield put({type: TYPES.ITEM_CREATE_COMPLETE, payload: R.clone(INIT_STATE_ITEM), id: _id});
}

function* deleteItemHandle({type, id}) {
    yield put({type: TYPES.ITEM_DELETE_COMPLETE, id});
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const button = R.clone(state.Components.InputArea[id]);
    const {key, value} = payload;

    if(value !== undefined){
        button.flags[key] = value;
    }else{
        button.flags[key] = !button.flags[key];
    }

    yield put({ type: TYPES.FLAGS_COMPLETE, payload: button.flags, id });
}