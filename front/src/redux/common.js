import produce from 'immer';

export function actionTemplate (sequence, template, divider){
    const result = {};

    Object.keys(template.root).map(k => {
        result[template.root[k]] = sequence.map(i=> i === 'root' ? template.root[k] : template[i]).join(divider);
    });

    return result
}

export function createReducer(cases = () => {}, defaultState = {}) {
    return (
        state = defaultState,
        action
    ) =>
        produce(state, draft => {
            if (action && action.type) {
                cases(action.type)(draft, action.payload, action.id);
            }
        });
}