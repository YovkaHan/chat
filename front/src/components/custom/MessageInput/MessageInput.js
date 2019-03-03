import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize} from "./redux/actions";
import {InputArea, Button} from '../../';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix} ${rootClass ? rootClass+'__'+sufix : ''}`
};

class MessageInput extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: ''
    };

    constructor(props){
        super(props);

        props.initialize(props.pcb);

      //  this.handleClick = ::this.handleClick;
    }

    // async handleClick(e){
    //     await this.props.defaultClick(e);
    //     await this.props.click(e);
    // };

    render(){
        const {props, state, handleClick} = this;
        const {flags, className, rootClass, pcb} = props;
        const {mayBeSend} = flags;
        const mainClass = 'my-msg-input';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <InputArea
                        pcb={pcb.make(pcb.children['InputArea'].name)}
                        label={null}
                        rootClass={'my-ia'}
                    />
                    <Button
                        pcb={pcb.make(pcb.children['Send'].name)}
                        value={'Send'}
                        disabled={!mayBeSend}
                        className={`${!mayBeSend? 'my-btn--disabled': ''}`}
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
    const cId = props.pcb.id;
    const _object = state.Components.MessageInput[cId];

    return ({
        flags: _object.flags,
        value: props.value ? props.value : _object.value
    })
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;

    return bindActionCreators({
        // defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        initialize: (pcb) => initialize(cId, pcb),
        onChange: (value) => dataChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(MessageInput);