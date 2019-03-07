import {TYPES} from './types';
import {createReducer} from '../../../../redux/common'
import * as R from 'ramda';

const INIT_STATE = {
  length: 0
};

export const INIT_STATE_ITEM = {
    flags: {
        toggle: false,
        hover: false,
        status: false
    },
    id: undefined,
    from: undefined,
    to: undefined,
    message: [],
    date: undefined
};

const cases = (type) => {
    console.log(TYPES);
    switch (type) {
        case TYPES.ITEM_CREATE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id] = payload;
                draft.length = draft.length+1;
            };
        }
        case TYPES.ITEM_DELETE_COMPLETE: {
            return (draft, payload, id) => {
                delete draft[id];
            };
        }
        case TYPES.FLAGS_COMPLETE: {
            return (draft, payload) => {
                draft[payload.id].flags = payload;
            };
        }
        case TYPES.INITIALIZE: {
            const _initClone = R.clone(INIT_STATE_ITEM);
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
