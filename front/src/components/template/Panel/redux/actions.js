import {TYPES} from "./types";
import * as R from 'ramda';

// export function initialize(id) {
//     return {type: TYPES.INITIALIZE, id};
// }

export function initializePanel(id, pcb) {
    return ({type: TYPES.INITIALIZE, payload: pcb, id})
}

// export function valueChange(id, value) {
//     return async (dispatch) => {
//         await dispatch({type: TYPES.CHANGE, payload: {key: 'value', value}, id});
//     }
// }
