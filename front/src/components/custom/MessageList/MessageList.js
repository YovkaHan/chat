import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initialize} from "./redux/actions";
import {InputArea, Button} from '../../';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class MessageList extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: []
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
        const {flags, className, rootClass, pcb, list} = props;
        const mainClass = 'my-msg-list';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()}>
                <div className={innerClass('content', mainClass, rootClass)}>
                </div>
            </div>
        )
    }
}

MessageList.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    list: PropTypes.array
};


const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const _object = state.Components.MessageList[cId];

    if(_object) {
        return ({
            flags: _object.flags,
            value: props.value ? props.value : _object.value
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;

    return bindActionCreators({
        initialize: (pcb) => initialize(cId, pcb),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(MessageList);