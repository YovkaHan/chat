import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {flagHandle, createItem, deleteItem} from "./redux/actions";
import moment from 'moment';

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' ' + rootClass + '__' + sufix : ''}`.trim()
};

class Message extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        disabled: false,
        from: 'TestFrom',
        createItem: () => {console.log('createItem function')},
        msg: 'Hello. My name is Test and this is test-message!',
        date: {
            seconds: 1551792177575,
            nanoseconds: 0
        }
    };

    constructor(props) {
        super(props);

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
        const {className, rootClass, disabled, from, msg, date} = props;
        const mainClass = 'c-message';

        return (
            <div
                className={`${mainClass}${disabled ? ` ${mainClass}--disabled` : ''} ${className} ${rootClass}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={innerClass('from', mainClass, rootClass)}>{from}</div>
                    <div className={innerClass('msg', mainClass, rootClass)}>{msg}</div>
                    <div className={innerClass('date', mainClass, rootClass)}>{moment(date.seconds * 1000).format('DD.MM.YYYY, HH:mm:ss a')}</div>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        this.props.deleteComponent()
    }
}

Message.propTypes = {
    pcb: PropTypes.object,
    className: PropTypes.string,
    rootClass: PropTypes.string,
    from: PropTypes.string,
    msg: PropTypes.string,
    date: PropTypes.number,
    createItem: PropTypes.func
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components.Message[cId];

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
    const cId = props.pcbMade.id;

    return bindActionCreators({
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        createItem: () => createItem(),
        deleteComponent: () => deleteItem(cId)
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        // valueChange: (value) => valueChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Message);
