import {TYPES} from './types';
import {createReducer} from '../../../../redux/common'
import * as R from 'ramda';


const INIT_STATE = {
    length: 0
};

/**
 * flags :
 *      stage(init, prepare, ready, destroy)
 * */

export const INIT_STATE_ITEM = {
    flags: {
        toggle: false,
        hover: false,
        status: false,
        stage: 'init',
        server: 'off',
        serverConnection: 'off',
        channel: 'off'
    },
    view: 'login',
    authToken: '',
    userId: '',
    userName: '',
    list: [],
    buffer: [],
    participantId: undefined
};

const cases = (type) => {
    switch (type) {
        case TYPES.ITEM_CREATE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id] = payload;
                draft.length = draft.length + 1;
            };
        }
        case TYPES.ITEM_DELETE_COMPLETE: {
            return (draft, payload, id) => {
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
        case TYPES.MSG_MAKE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].buffer.push(payload)
            };
        }
        case TYPES.PARTICIPANT_ID_SET: {
            return (draft, payload, id) => {
                draft[id].participantId = payload
            };
        }
        case TYPES.APP_STAGE_PREPARE: {
            return (draft, payload, id) => {
                draft[id].flags.stage = 'prepare'
            };
        }
        case TYPES.APP_STAGE_READY: {
            return (draft, payload, id) => {
                draft[id].flags.stage = 'ready'
            };
        }
        case TYPES.APP_STAGE_DESTROY: {
            return (draft, payload, id) => {
                draft[id].flags.stage = 'destroy'
            };
        }
        case TYPES.APP_SERVER_OFF: {
            return (draft, payload, id) => {
                draft[id].flags.server = 'off'
            };
        }
        case TYPES.APP_SERVER_ON: {
            return (draft, payload, id) => {
                draft[id].flags.server = 'on'
            };
        }
        case TYPES.APP_SERVER_CONNECTION_ON: {
            return (draft, payload, id) => {
                draft[id].flags.serverConnection = 'on'
            };
        }
        case TYPES.APP_SERVER_CONNECTION_OFF: {
            return (draft, payload, id) => {
                draft[id].flags.serverConnection = 'off'
            };
        }
        case TYPES.APP_CHANNEL_ON: {
            return (draft, payload, id) => {
                draft[id].flags.channel = 'on'
            };
        }
        case TYPES.APP_CHANNEL_OFF: {
            return (draft, payload, id) => {
                draft[id].flags.channel = 'off'
            };
        }
        case TYPES.APP_AUTHORIZATION_END: {
            return (draft, payload, id) => {
                draft[id].authToken = payload.authToken;
                draft[id].userId = payload.userId;
            };
        }
        case TYPES.APP_VIEW_LOGIN: {
            return (draft, payload, id) => {
                draft[id].view = 'login';
            };
        }
        case TYPES.APP_VIEW_MAIN: {
            return (draft, payload, id) => {
                draft[id].view = 'main';
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
