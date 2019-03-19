import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {flagHandle, createItem, valueChange, startChannel, connectChat} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class Chat extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        click: ()=>{}
    };

    constructor(props) {
        super(props);

        this.state = {
            dummy: ''
        };

        this.madeChildren = {
            Messages: null,
            Input: null
        };
        Object.keys(props.pcbMade.children).map(c=>{
            const name = props.pcbMade.children[c].component;

            this.madeChildren[c] = require('../../')[name].Component;
        });

        //props.startChannel();

        this.handleClick = ::this.handleClick;
    }

    componentDidUpdate(){
        if(this.props.flags.connection === 'off' && this.props.flags.channel === 'on'){
            this.props.connectChat();
        }
    }

    async handleClick(e) {
        if(!this.props.disabled){
            await this.props.defaultClick(e);
            await this.props.click(e);
        }
    };

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, pcb, pcbMade} = props;
        const {Messages, Input} = this.madeChildren;
        const {dummy} = state;
        const mainClass = 'c-chat';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <Messages
                        core={{pcb, id: pcbMade.children['Messages'].id, component: pcbMade.children['Messages'].component}}
                        rootClass={`msgs`}
                    />
                    <Input
                        core={{pcb, id: pcbMade.children['Input'].id, component: pcbMade.children['Input'].component}}
                        rootClass={`inpt-msg`}
                    />
                </div>
            </div>
        )
    }
}

Chat.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.Chat[cId];

    if(_object) {
        return ({
            flags: _object.flags,
            list: _object.list,
            buffer: _object.buffer
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        createItem: () => createItem(),
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        startChannel: () => startChannel(cId),
        connectChat: () => connectChat(cId)
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Chat);
