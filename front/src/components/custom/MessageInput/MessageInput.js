import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize} from "./redux/actions";
import {InputArea, Button} from '../../';

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
        //  this.handleClick = ::this.handleClick;
    }

    // async handleClick(e){
    //     await this.props.defaultClick(e);
    //     await this.props.click(e);
    // };

    render() {
        const {props, state, handleClick} = this;
        const {flags, className, rootClass, pcb, pcbMade} = props;
        const {mayBeSend} = flags;
        const mainClass = 'my-msg-input';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
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

MessageInput.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object
};


const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.MessageInput[cId];

    if (_object) {
        return ({
            flags: _object.flags,
            value: props.value ? props.value : _object.value
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        initialize: () => initialize(cId, props.pcbMade),
        // defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        //onChange: (value) => dataChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(MessageInput);