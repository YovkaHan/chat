import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {flagHandle, dataChange} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix} ${rootClass ? rootClass + '__' + sufix : ''}`
};

class InputArea extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        label: 'Label:',
        placeholder: '',
        pcb: {id: 'testId'},
        width: 300,
        click: ()=>{
            console.log('click')
        }
    };

    constructor(props) {
        super(props);

        this.handleClick = ::this.handleClick;
    }

    async handleClick(e) {
       // await this.props.defaultClick(e);
        await this.props.click(e);
    };

    handleChange = (e) => {
        const value = e.target.value;
        const result = value.length ? value.split(' '): [];

        this.props.dataChange(result);
    };

    render() {
        const {props, state, handleClick, handleChange} = this;
        const {
            label,
            className,
            rootClass,
            width,
            pcb,
            placeholder,
            data
        } = props;
        const {id} = pcb;
        const mainClass = 'c-input-area';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <label htmlFor={`${id}-l`} className={innerClass('label', mainClass, rootClass)}>{label}</label>
                    <textarea
                        id={`${id}-l`}
                        className={innerClass('input', mainClass, rootClass)}
                        placeholder={placeholder}
                        style={{width}}
                        value={data.join(' ')}
                        onChange={handleChange}
                    />
                </div>
            </div>
        )
    }
}

InputArea.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    placeholder: PropTypes.string,
    pcb: PropTypes.object,
    data: PropTypes.array,
    width: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    //defaultClick: PropTypes.func,
    click: PropTypes.func
};

const mapStateToProps = (state, props) => {
    const cId = props.pcb.id;
    const _object = state.Components.InputArea[cId];

    return ({
        flags: _object.flags,
        value: props.value ? props.value : _object.value,
        data: _object.data
    })
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcb.id;

    return bindActionCreators({
        //defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        dataChange: (data) => dataChange(cId, data)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(InputArea);
