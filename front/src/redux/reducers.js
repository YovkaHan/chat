import Button from '../components/custom/Button/redux/reducer';
import Lamp from '../components/custom/Button/redux/reducer';
import Panel from '../components/template/Panel/redux/reducer';
import Channel from '../components/template/Channel/redux/reducer'
import {combineReducers} from 'redux';
import produce from "immer";

export function actionTemplate (sequence, template, divider){
    const result = {};

    Object.keys(template.root).map(k => {
        result[template.root[k]] = sequence.map(i=> i === 'root' ? template.root[k] : template[i]).join(divider);
    });

    return result
}

export function createReducer(cases = () => {}, defaultState = {}, id) {
    return (
        state = defaultState,
        action
    ) =>
        produce(state, draft => {
            if (action && action.type && action.id === id) {
                cases(action.type)(draft, action.payload);
            }
        });
}

export default {
    Components: combineReducers({
        Button: combineReducers({
            b0: Button('b0'),
            b1: Button('b1'),
            b2: Button('b2'),
            b3: Button('b3')
        }),
        Lamp: combineReducers({
            l0: Lamp('l0'),
            l1: Lamp('l1')
        }),
        Channel: combineReducers({
            ch0: Channel('ch0'),
            ch1: Channel('ch1')
        }),
        Panel: combineReducers({
            pl0: Panel('pl0')
        })
    })
};
