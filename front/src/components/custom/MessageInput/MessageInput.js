import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize, sendMsg, deleteItem, initComponent} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' ' + rootClass + '__' + sufix : ''}`.trim()
};

class MessageInput extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: ''
    };

    constructor(props) {
        super(props);

        props.initialize();

        this.madeChildren = {
            InputArea: null,
            Send: null
        };
        Object.keys(props.pcbMade.children).map(c=>{
            const name = props.pcbMade.children[c].component;

            this.madeChildren[c] = require('../../')[name].Component;
        });
        //  this.handleClick = ::this.handleClick;
    }

    render() {
        const {props, state, handleClick} = this;
        const {sendAllow, className, rootClass, pcb, pcbMade, sendMsg} = props;
        const mainClass = 'my-msg-input';

        const InputArea = this.madeChildren.InputArea;
        const Send = this.madeChildren.Send;

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <InputArea
                        core={{pcb, id: pcbMade.children['InputArea'].id, component: pcbMade.children['InputArea'].component}}
                        label={null}
                        rootClass={'input-area'}
                    />
                    <Send
                        core={{pcb, id: pcbMade.children['Send'].id, component: pcbMade.children['Send'].component}}
                        value={'Send'}
                        disabled={!sendAllow}
                        className={`${!sendAllow ? 'my-btn--disabled' : ''}`.trim()}
                        rootClass={'send'}
                        click={sendMsg}
                    />
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        this.props.deleteComponent()
    }
}

MessageInput.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    sendAllow: PropTypes.bool
};


const mapStateToProps = (state, props) => {
    // const {InputArea} = props.pcbMade.children;
    const cId = props.pcbMade.id;
    const _object = state.Components.MessageInput[cId];
    // const _msg = state.Components[InputArea.component][InputArea.id].data;

    if (_object) {
        return ({
            sendAllow: _object.flags.mayBeSend,
            value: props.value ? props.value : _object.value
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        initialize: () => initComponent(cId, props.pcbMade),
        sendMsg: () => sendMsg(cId, props.pcbMade, props.from ? props.from : undefined, props.to ? props.to : undefined),
        deleteComponent: () => deleteItem(cId)
        // defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        //onChange: (value) => dataChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(MessageInput);