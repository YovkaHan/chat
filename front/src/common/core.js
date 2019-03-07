import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {actionTemplate, createReducer} from '../redux/reducers';
import * as R from 'ramda';
/**---------------------TYPES------------------------------*/
const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    FLAGS_COMPLETE: "FLAGS_COMPLETE"
};
const _sequence = ["name","root"];
const _template = {
    name: "CORE",
    root: {...defaultTypes}
};
const foo = (() =>{
    return actionTemplate(_sequence, _template, '__');
})();
export const TYPES = foo;
/**--------------------ACTIONS--------------------------------*/
export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}
export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}
/**--------------------REDUCER-------------------------------*/
const INIT_STATE = {
    flags: {
        toggle: false,
        hover: false
    },
    value: ''
};
const cases = (type) => {
    switch (type) {
        case TYPES.FLAGS_COMPLETE: {
            return (draft, payload) => {
                draft.flags = payload;
            };
        }
        case TYPES.CHANGE: {
            return (draft, payload) => {
                draft[payload.key] = payload.value;
            };
        }
        case TYPES.INITIALIZE: {
            const _initClone = R.clone(INIT_STATE);
            return draft => {
                Object.keys(_initClone).map(d => {
                    draft[d] = _initClone[d];
                });
            };
        }
        default : {
            return () => {
            }
        }
    }
};
const reducer = function (id) {
    return createReducer(cases, INIT_STATE, id);
};
export default reducer;
/**--------------------SAGAS------------------------------------*/
export default [
    takeEvery(TYPES.FLAGS, flagHandleComplete),
];

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