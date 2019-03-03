import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
// import {flagHandle, valueChange} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix} ${rootClass ? rootClass+'__'+sufix : ''}`
};

class Button extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        value: '',
        meta: {
            status: 'default',
            error: undefined
        }
    };

    constructor(props){
        super(props);
    }

    render(){
        const {props, state} = this;
        const {value, className, rootClass, meta} = props;
        const {status, error} = meta;
        const mainClass = 'c-lamp';
        let _className = className.slice();

        if(status === 'pending') {
            _className = `${_className} ${mainClass}--pending`;
        }
        if(status === 'done') {
            _className = `${_className} ${mainClass}--done`;
        }

        return(
            <div className={`${mainClass} ${_className} ${rootClass}`}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={innerClass('value', mainClass, rootClass)}>{value}</div>
                </div>
            </div>
        )
    }
}

Button.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    value: PropTypes.string,
    meta: PropTypes.object
};

const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const lamp = state.Components.Lamp[cId];

    return ({
        flags: lamp.flags,
        value: props.value ? props.value : lamp.value
    })
};

const mapDispatchers = (dispatch, props) => {
    // const cId = props.common.id;

    return bindActionCreators({
        // click: (e) => flagHandle(cId, 'clicked', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        // valueChange: (value) => valueChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Button);
