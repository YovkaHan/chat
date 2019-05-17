import React from 'react';
import * as R from 'ramda';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initItem, deleteItem, innerUpdate} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' ' + rootClass + '__' + sufix : ''}`.trim()
};

class ConversationView extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: {},
        stage: 'init'
    };

    constructor(props) {
        super(props);

        this.state = {
            updating: false
        };

        this.madeChildren = {
            Chat: null
        };
        Object.keys(props.pcbMade.children).map(c=>{
            const name = props.pcbMade.children[c].component;

            this.madeChildren[c] = require('../../')[name].Component;
        });

    }

    shouldComponentUpdate(nextProps) {
        if(nextProps.hasOwnProperty('updateAllow')){
            return nextProps.updateAllow;
        }
        if (nextProps.parentExist && nextProps.hasOwnProperty('_data')) {
            if (JSON.stringify(nextProps._data) !== JSON.stringify(this.props._data)) {
                // if (!nextProps.updatingProceed) {
                //     this.props.innerUpdate(nextProps._data);
                // }
                this.props.innerUpdate(nextProps._data);
                return true;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    render() {
        const {props, state, madeChildren} = this;
        const {Chat} = madeChildren;
        const {pcbMade, stage, className, rootClass, pcb, list, style} = props;
        const mainClass = 'c-conversation-view';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} style={style}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    {
                        stage === 'init' || stage === 'blank' ? (
                            <div className={`blank-view`}>

                            </div>
                        ) : null
                    }
                    {
                        stage === 'chat' ? (
                            <Chat
                                core={{pcb, id: pcbMade.children['Chat'].id, component: pcbMade.children['Chat'].component}}
                            />
                        ) : null
                    }
                    {
                        stage === 'new' ? (
                            <div className={`new-conversation-view`}>

                            </div>
                        ) : null
                    }
                </div>
            </div>
        )
    }

    componentWillUnmount() {
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
    let result = {};

    const Parent = props.pcbMade.relations.Parent;
    const _object = state.Components.ConversationView[cId];
    const parentObject = state.Components[Parent.component][Parent.id];

    if (_object) {
        result = {
            ...result,
            stage: _object.flags.stage,
            updatingProceed: _object.flags.updating,
            data: _object.data
        };
    } else {
        result.updateAllow = false
    }

    if (parentObject) {
        result = {
            ...result,
            parentExist: true,
            _data: {
                _conId: parentObject.conversation.data ? parentObject.conversation.data.id : undefined,
                _messageList: parentObject.conversation.data ? parentObject.conversation.data.messageList : [],
                _conParticipants: parentObject.conversation.data ? parentObject.conversation.data.participants : [],
                _conName: parentObject.conversation.data ? parentObject.conversation.data.name : undefined,
                _conSet: parentObject.conversation.data ? parentObject.conversation.data.set : undefined,
            }
        };
    } else {
        result.parentExist = false
    }

    return result;
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        // initialize: (pcb) => initItem(cId, pcb),
        deleteComponent: () => deleteItem(cId),
        innerUpdate: (data) => innerUpdate(cId, data)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ConversationView);