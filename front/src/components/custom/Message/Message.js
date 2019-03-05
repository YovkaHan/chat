import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {flagHandle} from "./redux/actions";
import moment from 'moment';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix} ${rootClass ? rootClass + '__' + sufix : ''}`
};

class Message extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        disabled: false,
        from: 'TestFrom',
        msg: 'Hello. My name is Test',
        date: 1551792177575
    };

    constructor(props) {
        super(props);

        this.handleClick = ::this.handleClick;

        this.
    }

    async handleClick(e) {
        if(!this.props.disabled){
            await this.props.defaultClick(e);
            await this.props.click(e);
        }
    };

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, from, msg, date} = props;
        const mainClass = 'c-message';

        return (
            <div className={`${mainClass} ${disabled ? mainClass+'--disabled' : ''} ${className} ${rootClass}`} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)} style={{width}}>
                    <div className={innerClass('from', mainClass, rootClass)}>{from}</div>
                    <div className={innerClass('msg', mainClass, rootClass)}>{msg}</div>
                    <div className={innerClass('date', mainClass, rootClass)}>{moment(date)}</div>
                </div>
            </div>
        )
    }
}

Message.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    from: PropTypes.string,
    msg: PropTypes.string,
    date: PropTypes.number
};

const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const _object = state.Components.Message[cId];

    return ({
        flags: _object.flags,
        value: props.value ? props.value : _object.value
    })
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;

    return bindActionCreators({
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        // valueChange: (value) => valueChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Message);
