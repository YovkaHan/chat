import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {flagHandle, createItem, valueChange} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class Chat extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        value: 'On',
        disabled: false,
        click: ()=>{}
    };

    constructor(props) {
        super(props);

        this.state = {
            width: 200
        };
        this.props.valueChange(props.value);

        this.handleClick = ::this.handleClick;
    }

    async handleClick(e) {
        if(!this.props.disabled){
            await this.props.defaultClick(e);
            await this.props.click(e);
        }
    };

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, disabled} = props;
        const {dummy} = state;
        const mainClass = 'c-chat';

        return (
            <div
                className={`${mainClass} ${disabled ? mainClass+'--disabled' : ''} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)}>
                    <InputArea.Component
                        core={{pcb, id: pcbMade.children['InputArea'].id, component: 'InputArea'}}
                        label={null}
                        rootClass={'my-ia'}
                    />
                    <Button.Component
                        core={{pcb, id: pcbMade.children['Send'].id, component: 'Button'}}
                        value={'Send'}
                        disabled={!mayBeSend}
                        className={`${!mayBeSend ? 'my-btn--disabled' : ''}`.trim()}
                        rootClass={'my-btn'}
                    />
                </div>
            </div>
        )
    }
}

Chat.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    pcb: PropTypes.object
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.Button[cId];

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
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Chat);
