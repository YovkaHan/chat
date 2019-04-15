import {select, takeEvery, put, take, fork} from 'redux-saga/effects'
import {TYPES, name} from "./types";
import {TYPES as IA_TYPES} from '../../InputArea/redux/types';
import * as R from "ramda";
import {INIT_STATE_ITEM} from "../../Button/redux/reducer";
import {TYPES as CTYPES} from "../../../../common/core";

const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.INITIALIZE, initiateTask),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.SEND_MSG, sendingMsg)
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

function* createItemHandle({type, id, coreId}) {
    const state = yield select();
    const index = state.Components.MessageInput.length;
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

    const _object = R.clone(state.Components.MessageInput[id]);
    const {key, value} = payload;

    if(value !== undefined){
        _object.flags[key] = value;
    }else{
        _object.flags[key] = !_object.flags[key];
    }

    yield put({ type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id });
}

function* sendingMsg({type, pcb, id, from, to}) {
    const {MsgConstructor} = pcb.relations;
    const {InputArea} = pcb.children;
    const _MCTypes = require(`../../${MsgConstructor.component}`).default.types;

    const state = yield select();
    const msg = state.Components[InputArea.component][InputArea.id].data;
    let _from = from;
    let _to = to;

    /**Затычка*/
    if(_from === undefined && _to === undefined){
        const make = pcb.make(pcb.relations.MsgConstructor.id);

        _from = make.config.from;
        _to = make.config.to;
    }

    yield put({ type: _MCTypes.MSG_MAKE, payload: msg, pcb, id: MsgConstructor.id, from: _from, to: _to });
}