import {TYPES} from "./types";
import * as R from 'ramda';

export function initialize(id, pcb) {
    return {type: TYPES.INITIALIZE, pcb, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}
