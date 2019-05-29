import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {actionTemplate, createReducer} from '../redux/common';
import * as R from 'ramda';

/** Сгенерить core id*/
/** Сгенерить child id*/
/** Замапить child id*/

export const rootIdGenerator = (() => {
    const root = {};
    let length = 0;

    const create = () => {
        let result = `core${length}`;
        length++;
        root[result] = null;
        return result;
    };

    const set = (coreId, id) => {
        if (result.hasOwnProperty(coreId)) {
            root[coreId] = id;
            return true;
        } else {
            return false;
        }
    };

    return {
        create,
        set
    };
})();

/**---------------------TYPES------------------------------*/
const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    CREATE: "CREATE",
    DELETE: "DELETE",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    CREATE_COMPLETE: "CREATE_COMPLETE"
};
const _sequence = ["name", "root"];
const _template = {
    name: "CORE",
    root: {...defaultTypes}
};
const foo = (() => {
    return actionTemplate(_sequence, _template, '__');
})();
export const TYPES = foo;

/**--------------------ACTIONS--------------------------------*/
export function initialize(id) {
    return {type: TYPES.INITIALIZE, id};
}

export function flagHandle(id, key, value) {
    return ({type: TYPES.FLAGS, payload: {key, value}, id})
}

export function createItem(id, childId) {
    return ({type: TYPES.CREATE, payload: childId, id})
}

export function deleteItem(id) {
    return ({type: TYPES.DELETE, id})
}

export function childItemCreated(id) {
    return ({type: TYPES.CREATE_COMPLETE, id})
}

/**--------------------REDUCER-------------------------------*/
const INIT_STATE = {
    length: 0
};
const cases = (type) => {
    switch (type) {
        case TYPES.FLAGS_COMPLETE: {
            return (draft, payload) => {
                draft.flags = payload;
            };
        }
        case TYPES.CREATE: {
            return (draft, payload, id) => {
                draft.length++;
                draft[id] = {childId: payload, status: true, created: false};
            };
        }
        case TYPES.CREATE_COMPLETE: {
            return (draft, payload, id) => {
                draft[id] = {...draft[id], created: true};
            };
        }
        case TYPES.DELETE: {
            return (draft, payload, id) => {
                draft.length--;
                delete draft[id];
            };
        }
        case TYPES.CHANGE: {
            return (draft, payload) => {
                draft[payload.key] = payload.value;
            };
        }
        case TYPES.INITIALIZE: {
            const _initClone = R.clone(INIT_STATE);
            return draft => {
                Object.keys(_initClone).map(d => {
                    draft[d] = _initClone[d];
                });
            };
        }
        default : {
            return () => {
            }
        }
    }
};
export const reducer = function () {
    return createReducer(cases, INIT_STATE);
};
// let num = 0;

class Core extends React.Component {

    constructor(props) {
        super(props);

        const {createChildItem, core, childItemCreated, coreId} = props;
        const {id} = core;

        this.state = {
            status: false,
            created: false
        };
        createChildItem(props.coreId, id, () => childItemCreated(props.coreId));
    }

    callback() {
        this.setState({created: true}, () => {
            this.state.created = true;
            console.log(this.state);
        })
    }

    // componentDidUpdate(props, state){
    //     if(!state.status && this.props.items.hasOwnProperty(state.id)){
    //         this.setState({status: true})
    //     }
    // }

    render() {
        const {status} = this.state;
        const {children, item, core, coreId, itemCreated} = this.props;
        const {component, template, pcb, relations} = core;

        // num++;
        // console.log(coreId, 'render', num);

        const child = (c, index) => {

            return React.cloneElement(
                c,
                {
                    key: index,
                    pcbMade: component ? pcb.make(item.childId, template, relations) : {},
                    pcb,
                    ...(() => {
                        const result = {};
                        Object.keys(this.props).map(key => {
                            if (key !== 'core')
                                result[key] = this.props[key];
                        });
                        return result;
                    })()
                }
            )
        };

        return item && itemCreated ? (
            <React.Fragment>
                {
                    child(children)
                }
            </React.Fragment>
        ) : null
    }

    componentWillUnmount() {
        this.props.deleteComponent(this.props.coreId)
    }
}

const mapStateToProps = (state, props) => {
    const item = state.Components.Core[props.coreId];

    return ({
        item,
        itemCreated: item ? item.created : false
    })
};

const mapDispatchers = (dispatch, props) => {

    const {createItem} = require(`../components/`)[props.core.component].actions;

    return bindActionCreators({
        createChildItem: (id, childId, afterCreated) => createItem(childId, id, afterCreated),
        deleteComponent: (id) => deleteItem(id),
        childItemCreated: (id) => childItemCreated(id)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Core);

/**свойство "component" указатель на то что для конкретного компонента должен быть сгенерен pcbMade
 * если оно не указано то пропускаем этот шаг
 * */
