import {TYPES} from "./types";
import * as R from 'ramda';

export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function addItem(id) {
    return ({type: TYPES.CREATE_ITEM, id})
}

export function deleteItem(id) {
    return ({type: TYPES.DELETE_ITEM, id})
}

// export function valueChange(id, value) {
//     return async (dispatch) => {
//         await dispatch({type: TYPES.CHANGE, payload: {key: 'value', value}, id});
//     }
// }
