import {select, takeEvery, put, take, fork} from 'redux-saga/effects'
import {TYPES} from "./types";
import {TYPES as IA_TYPES} from '../../InputArea/redux/types';
import * as R from "ramda";

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.INITIALIZE, initiateTask)
];

function* inputAreaListenSaga(pcb) {
    const {InputArea} = pcb.children;
    const _IATypes = require(`../../${InputArea.component}/redux/types`).TYPES;

    while (true) {
        const {id} = yield take(_IATypes.CHANGE);

        if(id === InputArea.id){
            const state = yield select();

            const _object = R.clone(state.Components[InputArea.component][InputArea.id]);

            if(_object.data.length){
                yield put({type: TYPES.FLAGS, payload: {key: 'mayBeSend', value: true}, id: pcb.id})
            } else {
                yield put({type: TYPES.FLAGS, payload: {key: 'mayBeSend', value: false}, id: pcb.id})
            }
        }
    }
}

function* initiateTask({type, pcb, id}) {
    yield fork(inputAreaListenSaga, pcb, id);
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const _object = R.clone(state.Components.MessageInput[id]);
    const {key, value} = payload;

    if(value !== undefined){
        _object.flags[key] = value;
    }else{
        _object.flags[key] = !_object.flags[key];
    }

    yield put({ type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id });
}