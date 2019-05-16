import React from 'react';
import * as R from 'ramda';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initItem, deleteItem} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class ConversationView extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: {}
    };

    constructor(props){
        super(props);

        this.state = {

        };

        this.madeRelations = {
            Contact: null
        };
        Object.keys(props.pcbMade.relations).map(c=>{
            const name = props.pcbMade.relations[c].component;

            this.madeRelations[c] = require('../../')[name].Component;
        });

    }

    // shouldComponentUpdate(props){
    //     if(props.updateAllow){
    //         return false
    //     }else {
    //         return true;
    //     }
    // }

    render(){
        const {props, state, madeRelations} = this;
        const {Contact} = madeRelations;
        const {pcbMade, flags, className, rootClass, pcb, list, style} = props;
        const mainClass = 'c-conversation-view';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} style={style}>
                <div className={innerClass('content', mainClass, rootClass)}>
                </div>
            </div>
        )
    }
    componentWillUnmount(){
        this.props.deleteComponent()
    }
}
ConversationView.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    list: PropTypes.object,
    updateAllow: PropTypes.bool
};


const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;

    const Parent = props.pcbMade.relations.Parent;
    const _object = state.Components.ConversationView[cId];
    const parentObject = state.Components[Parent.component][Parent.id];

    if(_object) {
        return ({
            flags: _object.flags,
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        // initialize: (pcb) => initItem(cId, pcb),
        deleteComponent: () => deleteItem(cId),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ConversationView);