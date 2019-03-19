import {select, takeEvery, put} from 'redux-saga/effects'
import {TYPES, name} from "./types";
import * as R from "ramda";
import {INIT_STATE_ITEM} from './reducer';
import {TYPES as CTYPES} from "../../../../common/core";
import axios from 'axios';

function req(options) {
    return axios({
        ...options,
        withCredentials: true
    }).then(
        (response) => response.data,
        (error) => { console.log(error) }
    );
}


const idMake = (index) => name + index;

export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
    takeEvery(TYPES.ITEM_CREATE, createItemHandle),
    takeEvery(TYPES.ITEM_DELETE, deleteItemHandle),
    takeEvery(TYPES.ITEM_INITIALIZE, initializeItem)
];

function* createItemHandle({type, id, coreId}) {
    const state = yield select();
    const index = state.Components.Contacts.length;
    const _id = id ? id : idMake(index);

    if (coreId !== undefined)
        yield put({type: CTYPES.CREATE, payload:_id, id: coreId});

    yield put({type: TYPES.ITEM_CREATE_COMPLETE, payload: R.clone(INIT_STATE_ITEM), id: _id});
}

function* deleteItemHandle({type, id}) {
    yield put({ type: TYPES.ITEM_DELETE_COMPLETE, id });
}

function* flagHandleComplete({type, payload, id}) {
    const state = yield select();

    const _object = R.clone(state.Components.Contacts[id]);
    const {key, value} = payload;

    if(value !== undefined){
        _object.flags[key] = value;
    }else{
        _object.flags[key] = !_object.flags[key];
    }

    yield put({ type: TYPES.FLAGS_COMPLETE, payload: _object.flags, id });
}

function* initializeItem({type, id, coreId}) {
    const options = {
        url: '/contacts',
        method: 'get',
        baseURL: SERVER
    };

    req(options).then((result)=>{
        console.log(result);
    })
}