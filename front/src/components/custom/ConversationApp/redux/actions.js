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

export function connectApp(id) {
    return ({type: TYPES.CHANNEL_APP_CONNECT, id})
}

export function connectionTry(id) {
    return ({type: TYPES.APP_SERVER_CONNECTION_TRY, id})
}

export function appAuthorize(id) {
    return ({type: TYPES.APP_AUTHORIZATION_BEGIN, id, payload: {}})
}

export function logIn(id, userId) {
    return ({type: TYPES.APP_LOGIN_BEGIN, id, payload: {userId}})
}

export function logOut(id) {
    return ({type: TYPES.APP_LOGOUT_BEGIN, id})
}

export function appStageConnecting(id) {
    return ({type: TYPES.APP_STAGE_CONNECTING, id})
}

export function conversationGet(id, conversationId) {
    return ({type: TYPES.APP_CONVERSATION_GET, payload: {conversationId}, id})
}

export function eventManager(id, pcb) {
    return ({type: TYPES.APP_EVENT_MANAGER, payload: {pcb}, id})
}

export default {
    initialize,
    flagHandle,
    createItem,
    deleteItem,
    appAuthorize,
    logIn,
    logOut,
    appStageConnecting,
    conversationGet,
    eventManager
}