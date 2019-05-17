import {TYPES} from './types';
import * as R from 'ramda';

export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function valueChange(id, value) {
    return ({type: TYPES.CHANGE, payload: {key: 'value', value}, id})
}

export function createItem(id, coreId, afterCreated) {
    return ({type: TYPES.ITEM_CREATE, coreId, id, payload:{callback:afterCreated}})
}

export function deleteItem(id) {
    return ({type: TYPES.ITEM_DELETE, id})
}

export function startChannel(id) {
    return ({type: TYPES.CHANNEL_START, id})
}

export function connectChat(id) {
    return ({type: TYPES.CHANNEL_CHAT_CONNECT, id})
}

export default {
    initialize,
    flagHandle,
    createItem,
    deleteItem
}