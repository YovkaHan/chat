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
        server: 'off',
        connection: 'off'
    },
    list: [
        // {
        //     cId: '1',
        //     id: 'm1551792177575m0',
        //     from: 'TestFrom',
        //     to: 'TestTo',
        //     msg: 'Hello. My name is Test and this is test-message!',
        //     date: 1551792177575
        // },
        // {
        //     cId: '1',
        //     id: 'm1551792177575m1',
        //     from: 'TestFrom',
        //     to: 'TestTo',
        //     msg: 'Hello. My name is Test and this is test-message!',
        //     date: 1551792177575
        // },
        // {
        //     cId: '1',
        //     id: 'm1551792177575m2',
        //     from: 'TestFrom',
        //     to: 'TestTo',
        //     msg: 'Hello. My name is Test and this is test-message!',
        //     date: 1551792177575
        // },
        // {
        //     cId: '1',
        //     id: 'm1551792177575m3',
        //     from: 'TestFrom',
        //     to: 'TestTo',
        //     msg: 'Hello. My name is Test and this is test-message!',
        //     date: 1551792177575
        // },
        // {
        //     cId: '1',
        //     id: 'm1551792177575m4',
        //     from: 'TestFrom',
        //     to: 'TestTo',
        //     msg: 'Hello. My name is Test and this is test-message!',
        //     date: 1551792177575
        // }
    ],
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
        case TYPES.SERVER_OFF: {
            return (draft, payload, id) => {
                draft[id].flags.server = 'off'
            };
        }
        case TYPES.SERVER_ON: {
            return (draft, payload, id) => {
                draft[id].flags.server = 'on'
            };
        }
        case TYPES.CONNECTION_ON: {
            return (draft, payload, id) => {
                draft[id].flags.connection = 'on'
            };
        }
        case TYPES.CONNECTION_OFF: {
            return (draft, payload, id) => {
                draft[id].flags.connection = 'off'
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
