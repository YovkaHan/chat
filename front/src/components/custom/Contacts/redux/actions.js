import {TYPES} from "./types";
import * as R from 'ramda';

export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function initItem(id, pcb) {
    return {type: TYPES.ITEM_INITIALIZE, payload: pcb, id};
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

// export function valueChange(id, value) {
//     return async (dispatch) => {
//         await dispatch({type: TYPES.CHANGE, payload: {key: 'value', value}, id});
//     }
// }

export default {
    initialize,
    initItem,
    flagHandle,
    createItem,
    deleteItem
}