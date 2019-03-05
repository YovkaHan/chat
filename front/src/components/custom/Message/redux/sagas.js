import {select, takeEvery, put} from 'redux-saga/effects'
import {TYPES} from "./types";
import * as R from "ramda";

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.CREATE_ITEM, createItemHandle),
    takeEvery(TYPES.DELETE_ITEM, deleteItemHandle),
];

function* createItemHandle({type, id}) {
    const state = yield select();

    const _object = R.clone(state.Components.Message[id]);
}

function* deleteItemHandle({type, id}) {
    const state = yield select();

    yield put({ type: TYPES., payload: button.flags, id });

    //const _object = R.clone(state.Components.Message[id]);
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const button = R.clone(state.Components.Button[id]);
    const {key, value} = payload;

    if(value !== undefined){
        button.flags[key] = value;
    }else{
        button.flags[key] = !button.flags[key];
    }

    yield put({ type: TYPES.FLAGS_COMPLETE, payload: button.flags, id });
}