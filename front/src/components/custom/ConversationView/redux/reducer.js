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
        status: false,
        updating: false,
        stage: 'init' /**init, chat, blank, new*/
    },
    data: {
        messageList: [],
        messageBuffer: {},
        conId: undefined,
        conName: undefined,
        conSet: undefined,
    },
    _data: {
        _messageList: [],
        _messageBuffer: {},
        _conId: undefined,
        _conName: undefined,
        _conSet: undefined,
    }

};

const cases = (type) => {
    switch (type) {
        case TYPES.LENGTH_PLUS: {
            return (draft, payload, id) => {
                draft.length = draft.length + payload;
            };
        }
        case TYPES.ITEM_CREATE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id] = payload;
            };
        }
        case TYPES.ITEM_DELETE_COMPLETE: {
            return (draft, payload, id) => {
                draft.length = draft.length - 1;
                delete draft[id];
            };
        }
        case TYPES.FLAGS_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].flags = payload;
            };
        }
        case TYPES.CHANGE: {
            return (draft, payload, id) => {
                draft[id][payload.key] = payload.value;
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
        case TYPES.INNER_UPDATE: {
            return (draft, payload, id) => {
                draft[id].flags.updating = true;
            };
        }
        case TYPES.VIEW_STATUS: {
            return (draft, payload, id) => {
                if(!draft[id].flags.updating && draft[id].data.conId){
                    draft[id].flags.stage = 'chat';
                }else if(!draft[id].flags.updating && !draft[id].data.conId) {
                    draft[id].flags.stage = 'blank';
                }
            };
        }
        case TYPES.INNER_UPDATE_COMPLETE: {
            return (draft, payload, id) => {
                Object.keys(payload).map(key =>{
                    draft[id]._data[`_${key}`] = R.clone(payload[key]);
                    draft[id].data[key] = R.clone(payload[key]);
                });
                draft[id].flags.updating = false;
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
