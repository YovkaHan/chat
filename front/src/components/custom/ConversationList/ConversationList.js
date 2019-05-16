import React from 'react';
import * as R from 'ramda';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initItem, deleteItem} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class Conversation extends React.Component {
    static defaultProps = {
        className: '',
        rootClass: '',
        list: []
    };

    constructor(props){
        super(props);

        this.state = {

        };
    }

    chooseConversation = () => {
        this.props.chooseConversationHandler(this.props.data.id);
    };

    render(){
        const {props, state, chooseConversation} = this;
        const {className, rootClass, data} = props;
        const mainClass = 'conversation';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} onClick={chooseConversation}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={`${mainClass}__name`}>{data.name}</div>
                </div>
            </div>
        )
    }
}

class ConversationList extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: []
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

    chooseConversationHandler = (convId) => {
        this.props.chooseConversation(convId);
    };

    render(){
        const {props, state, chooseConversationHandler} = this;
        const {className, rootClass, list, style} = props;
        const mainClass = 'c-conversations';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} style={style}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={`panel`}>
                        <input type="text" className={`panel__item input-search`}/>
                        <div className={`panel__item close-btn hidden`}>
                            <i className={`icon material-icons`}>
                                close
                            </i>
                        </div>
                        <div className={`panel__item add-btn`}>
                            <i className={`icon material-icons`}>
                                add
                            </i>
                        </div>
                    </div>
                    <div className={`list`}>
                        {
                            Object.keys(list).map(key => (
                                <Conversation
                                    key={key}
                                    data={list[key]}
                                    className={rootClass+'__item'}
                                    chooseConversationHandler={chooseConversationHandler}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        this.props.deleteComponent()
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
            list: R.clone(parentObject.conversations.data)
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;
    const Parent = props.pcbMade.relations.Parent;

    const {conversationGet} = require('../../')[Parent.component].actions;

    return bindActionCreators({
        // initialize: (pcb) => initItem(cId, pcb),
        chooseConversation: (conversationId) => conversationGet(Parent.id, conversationId),
        deleteComponent: () => deleteItem(cId),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ConversationList);