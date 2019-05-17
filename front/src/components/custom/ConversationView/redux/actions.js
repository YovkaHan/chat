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

export function updateAllow(id) {
    return ({type: TYPES.FLAGS, payload: {key: 'update', value: true}, id})
}

export function updateForbit(id) {
    return ({type: TYPES.FLAGS, payload: {key: 'update', value: false}, id})
}

export function initialized(id) {
    return ({type: TYPES.FLAGS, payload: [{key: 'initiated', value: true}, {key: 'stage', value: 'waiting'}], id})
}

export function innerUpdate(id, data) {
    return ({type: TYPES.INNER_UPDATE, id, payload: data})
}

export default {
    initialize,
    flagHandle,
    createItem,
    deleteItem,
    updateAllow,
    updateForbit,
    initialized,
    innerUpdate
}