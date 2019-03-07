import produce from "immer/dist/immer";

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
            if (action && action.type && action.id === id || id === undefined) {
                cases(action.type)(draft, action.payload, action.id);
            }
        });
}