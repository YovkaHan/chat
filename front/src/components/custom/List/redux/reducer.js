import {TYPES} from './types';
import {createReducer} from '../../../../redux/reducers'
import * as R from 'ramda';

const INIT_STATE = {
    flags: {
        hover: false,
        status: false
    }
};

const cases = (type) => {
    switch (type) {
        case TYPES.FLAGS_COMPLETE: {
            return (draft, payload) => {
                draft.flags = payload;
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
