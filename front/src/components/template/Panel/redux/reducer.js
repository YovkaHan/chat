import {TYPES} from './types';
import {createReducer} from '../../../../redux/reducers'
import * as R from 'ramda';

const INIT_STATE = {
    data: [],
    chanelStatus: 'off',
    serverStatus: 'unknown'
};

const cases = (type) => {
    switch (type) {
        case TYPES.SERVER_ON: {
            return (draft) => {
                draft.lastAction = TYPES.PROCESSING;
            };
        }
        case TYPES.PROCESSING_PENDING: {
            return (draft) => {
                draft.dataStatus = 'pending';
                draft.lastAction = TYPES.PROCESSING_PENDING;
            };
        }
        case TYPES.PROCESSING_COMPLETE: {
            return (draft) => {
                draft.dataStatus = 'complete';
                draft.lastAction = TYPES.PROCESSING_COMPLETE;
            };
        }
        case TYPES.SET_SOCKET: {
            return (draft) => {
                draft.lastAction = TYPES.SET_SOCKET;
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
