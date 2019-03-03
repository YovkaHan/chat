import io from 'socket.io-client';
import {eventChannel} from 'redux-saga';
import {take, call, put, fork, race, cancelled, takeEvery, all, delay} from 'redux-saga/effects';
import Chanel from '../../Channel/redux/sagas';
import {TYPES} from "./types";
import * as R from "ramda";


function* initializePath({type, payload, id}) {
    // const state = yield select();
    //
    // const button = R.clone(state.Components.Panel[id]);
    const {channels} = payload;

    yield put({ type: TYPES.INITIALIZE_COMPLETE, id });

    yield all(channels.map(c => call(Chanel, c.id)));
}

export default [
    takeEvery(TYPES.INITIALIZE, initializePath)
]