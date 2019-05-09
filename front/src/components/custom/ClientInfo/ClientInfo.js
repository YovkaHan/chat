import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {flagHandle, createItem, byKeyChange} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class ClientInfo extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        click: ()=>{},
        defaultAva: '',
        defaultName: 'Test Name'
    };


    constructor(props) {
        super(props);

        this.state = {

        };

        // this.madeChildren = {
        //     Messages: null,
        //     Input: null
        // };
        // Object.keys(props.pcbMade.children).map(c=>{
        //     const name = props.pcbMade.children[c].component;
        //
        //     this.madeChildren[c] = require('../../')[name].Component;
        // });

        this.handleClick = ::this.handleClick;
    }

    static getDerivedStateFromProps(props, state){
        return {
            ...state,
            name: props.name ? props.name : props.defaultName,
            ava: props.ava ? props.ava : props.defaultAva
        }
    }

    componentDidUpdate(){

    }

    async handleClick(e) {
        if(!this.props.disabled){
            await this.props.defaultClick(e);
            await this.props.click(e);
        }
    };

    render() {
        const {props, state, handleClick} = this;
        const {className, rootClass, pcb, pcbMade} = props;
        // const {Messages, Input} = this.madeChildren;
        const {ava, name} = state;
        const mainClass = 'c-client-info';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={`${mainClass}__avatar avatar`}>
                        <div className={`avatar__pic`} style={{backgroundImage: `url(${ava})`}}></div>
                    </div>
                    <div className={`${mainClass}__name`}>{name}</div>
                </div>
            </div>
        )
    }
}

ClientInfo.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    defaultAvaSrc: PropTypes.string,
    defaultName: PropTypes.string
};

const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;

    const Parent = props.pcbMade.relations.Parent;
    const _object = state.Components.ClientInfo[cId];
    const parentObject = state.Components[Parent.component][Parent.id];

    const result = {};

    result.flags = _object ? _object.flags : {};
    result.ava = parentObject ? parentObject.user.ava : {};
    result.name = parentObject ? parentObject.user.name : {};

    return result;
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        createItem: () => createItem(),
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        avaChange: (value) => byKeyChange(cId, 'avaSrc', value),
        nameChange: (value) => byKeyChange(cId, 'name', value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ClientInfo);