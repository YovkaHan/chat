import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {actionTemplate, createReducer} from '../redux/common';
import * as R from 'ramda';

/** Сгенерить core id*/
/** Сгенерить child id*/
/** Замапить child id*/

const rootIdGenerator = (() => {
    const root = {};
    let length = 0;

    const create =()=>{
        let result = `core${length}`;
        length++;
        root[result] = null;
        return result;
    };

    const set = (coreId, id) => {
        if(result.hasOwnProperty(coreId)){
            root[coreId] = id;
            return true;
        } else {
            return false;
        }
    };

    return  {
        create,
        set
    };
})();

/**---------------------TYPES------------------------------*/
const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    CREATE: "CREATE",
    FLAGS_COMPLETE: "FLAGS_COMPLETE"
};
const _sequence = ["name","root"];
const _template = {
    name: "CORE",
    root: {...defaultTypes}
};
const foo = (() =>{
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
                draft[id] = {childId: payload, status: true};
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

class Core extends React.Component {

    constructor(props){
        super(props);

        const {createChildItem, core} = props;
        const {id, component, template, pcb} = core;

        this.state = {
            id: rootIdGenerator.create(),
            status: false
        };

        createChildItem(this.state.id, id);
    }

    componentDidUpdate(props, state){
        if(!state.status && this.props.items.hasOwnProperty(state.id)){
            this.setState({status: true})
        }
    }

    // shouldComponentUpdate() {
    //     return !this.state.status;
    // }

    render(){
        const {status, id, madeSet} = this.state;
        const {children, items, core} = this.props;
        const {component, template, pcb} = core;

        const child = (c, index) => {

            return React.cloneElement(
                c,
                {
                    key: index,
                    pcbMade: component ? pcb.make(items[id].childId, template) : {},
                    pcb,
                    ...(()=>{
                        const result = {};
                        Object.keys(this.props).map(key=>{
                            if(key !== 'core')
                                result[key] = this.props[key];
                        });
                        return result;
                    })()
                }
            )
        };

        return status ? (
             <React.Fragment>
                {
                    child(children)
                }
            </React.Fragment>
        ) : null
    }
}

const mapStateToProps = (state, props) => {
   return ({
       items: state.Components.Core
   })
};

const mapDispatchers = (dispatch, props) => {

    const {createItem} = require(`../components/`)[props.core.component].actions;

    return bindActionCreators({
        createChildItem: (id, childId) => createItem(childId, id),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Core);

/**свойство "component" указатель на то что для конкретного компонента должен быть сгенерен pcbMade
 * если оно не указано то пропускаем этот шаг
 * */
