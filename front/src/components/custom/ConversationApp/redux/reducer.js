import {TYPES} from './types';
import {createReducer} from '../../../../redux/common'
import * as R from 'ramda';


const INIT_STATE = {
    length: 0
};

/**
 * flags :
 *      stage(init, prepared, connecting, ready, destroy)
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
    user: {
        data: {},
        type: 'object',
        status: 'init'
    },
    contacts: {
        data: {},
        type: 'object',
        status: 'init'
    },
    conversations: {
        data: {},
        type: 'object',
        status: 'init'
    },
    conversation: {
        chosen: false,
        data: {}
    },
    participantId: undefined
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
        case TYPES.APP_STAGE_PREPARED: {
            return (draft, payload, id) => {
                draft[id].flags.stage = 'prepared'
            };
        }
        case TYPES.APP_STAGE_CONNECTING: {
            return (draft, payload, id) => {
                draft[id].flags.stage = 'connecting'
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
        case TYPES.APP_USER_INFO_COMPLETE: {
            return (draft, payload, id) => {
                if (payload.id) {
                    draft[id].user = payload;
                } else {
                    const contact = draft[id].contacts.data[payload.login];
                    Object.keys(payload).map(key => {
                        contact[key] = payload[key];
                    })
                }
            };
        }
        case TYPES.APP_USER_CONTACTS_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].contacts = {...draft[id].contacts, data: payload};
            };
        }
        case TYPES.APP_USER_CONVERSATIONS_COMPLETE: {
            return (draft, payload, id) => {
                draft[id].conversations = {...draft[id].conversations, data: payload};
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
