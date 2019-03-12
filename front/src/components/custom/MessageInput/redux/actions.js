import {TYPES} from "./types";
import * as R from 'ramda';

export function initialize(id, pcb) {
    return {type: TYPES.INITIALIZE, pcb, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function createItem(id, coreId) {
    return ({type: TYPES.ITEM_CREATE, coreId, id})
}

export function deleteItem(id) {
    return ({type: TYPES.ITEM_DELETE, id})
}

export default {
    initialize,
    flagHandle,
    createItem,
    deleteItem
}