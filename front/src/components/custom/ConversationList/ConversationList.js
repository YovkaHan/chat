import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initItem} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class Conversation extends React.Component {
    static defaultProps = {
        className: '',
        rootClass: '',
        list: {}
    };

    constructor(props){
        super(props);

        this.state = {

        };
    }

    render(){
        const {props, state} = this;
        const {className, rootClass} = props;
        const mainClass = 'conversation';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} style={style}>
                <div className={innerClass('content', mainClass, rootClass)}>
                </div>
            </div>
        )
    }
}

class ConversationList extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: {}
    };

    constructor(props){
        super(props);

        this.state = {

        };
    }

    // shouldComponentUpdate(props){
    //     if(props.updateAllow){
    //         return false
    //     }else {
    //         return true;
    //     }
    // }

    render(){
        const {props, state} = this;
        const {className, rootClass, list, style} = props;
        const mainClass = 'c-conversations';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} style={style}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    {
                        list.map(c => (
                            <Conversation
                                key={c.id}
                                data={c}
                                className={rootClass+'__item'}
                            />
                        ))
                    }
                </div>
            </div>
        )
    }
}
ConversationList.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    list: PropTypes.object,
    updateAllow: PropTypes.bool
};


const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;

    const Parent = props.pcbMade.relations.Parent;
    const _object = state.Components.ConversationList[cId];
    const parentObject = state.Components[Parent.component][Parent.id];

    if(_object) {
        return ({
            flags: _object.flags,
            updateAllow: _object.flags.update,
            list: parentObject.conversations.data
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        // initialize: (pcb) => initItem(cId, pcb),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ConversationList);