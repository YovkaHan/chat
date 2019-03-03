import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {flagHandle} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix} ${rootClass ? rootClass+'__'+sufix : ''}`
};

class Button extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        value: 'On',
    };

    constructor(props){
        super(props);

        this.state = {
            width: 200
        };

        this.handleClick = ::this.handleClick;
    }

    async handleClick(e){
       await this.props.defaultClick(e);
       await this.props.click(e);
    };

    render(){
        const {props, state, handleClick} = this;
        const {value, className, rootClass} = props;
        const {width} = state;
        const mainClass = 'c-button';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)} style={{width}}>
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
};

const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const button = state.Components.Button[cId];

    return ({
        flags: button.flags,
        value: props.value ? props.value : button.value
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

export default connect(mapStateToProps, mapDispatchers)(Button);
