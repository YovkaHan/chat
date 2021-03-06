import {select, take, takeEvery, put} from 'redux-saga/effects'
import {TYPES} from "./types";
import * as R from "ramda";

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
];

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const button = R.clone(state.Components.Button[id]);
    const {key, value} = payload;

    setAllFalseFor(button.flags, [key]);

    if (value !== undefined) {
        button.flags[key] = value;
    } else {
        button.flags[key] = !button.flags[key];
    }

    yield put({type: TYPES.FLAGS_COMPLETE, payload: button.flags, id});
}

function setAllFalseFor(object, exeptKeys = []) {
    Object.keys(object).map(key => {
        if (exeptKeys.indexOf(key) === -1)
            object[key] = false
    })
}