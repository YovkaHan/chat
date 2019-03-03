import {TYPES} from "./types";
import * as R from 'ramda';

export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function startChanel(id) {
    return ({type: TYPES.CHANNEL_START, id})
}

export function connectToChat(id) {
    return ({type: TYPES.CHANNEL_CHAT_CONNECT, id})
}

export function sendMessage(id, from, to) {
    return ({type: TYPES.CHANNEL_CHAT_SEND, payload: {from, to}, id})
}

// export function valueChange(id, value) {
//     return async (dispatch) => {
//         await dispatch({type: TYPES.CHANGE, payload: {key: 'value', value}, id});
//     }
// }
