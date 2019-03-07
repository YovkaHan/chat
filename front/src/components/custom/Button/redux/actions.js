import {TYPES} from './types';
import * as R from 'ramda';

export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function createItem() {
    return ({type: TYPES.ITEM_CREATE})
}

export function deleteItem(id) {
    return ({type: TYPES.ITEM_DELETE, id})
}