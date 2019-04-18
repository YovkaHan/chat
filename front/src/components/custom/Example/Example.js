import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {componentName} from './';
import {bindActionCreators} from 'redux';
import {flagHandle, createItem, valueChange} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class Example extends React.Component {

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

        this.madeChildren = {
            Child: null
        };
        Object.keys(props.pcbMade.children).map(c=>{
            const name = props.pcbMade.children[c].component;

            this.madeChildren[c] = require('../../')[name].Component;
        });

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
        const {value, className, rootClass, disabled} = props;
        const {Child} = this.madeChildren;
        const {width} = state;
        const mainClass = 'c-example';

        return (
            <div
                className={`${mainClass} ${disabled ? mainClass+'--disabled' : ''} ${className} ${rootClass} ${disabled ? rootClass+'--disabled' : ''}`.trim()}
                onClick={handleClick}
            >
                <div className={innerClass('content', mainClass, rootClass)} style={{width}}>
                    <div className={innerClass('value', mainClass, rootClass)}>{value}</div>
                </div>
            </div>
        )
    }
}

Example.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    value: PropTypes.string,
    disabled: PropTypes.bool,
    pcb: PropTypes.object
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;
    const _object = state.Components[componentName][cId];

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
        createItem: () => createItem(),
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        valueChange: (value) => valueChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Example);
