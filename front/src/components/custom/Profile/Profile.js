import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {componentName} from './';
import {bindActionCreators} from 'redux';
import {flagHandle, createItem, valueChange, deleteItem} from './redux/actions';

const innerClass = (suffix, mainClass, rootClass) => {
    return `${mainClass}__${suffix} ${rootClass ? rootClass + '__' + suffix : ''}`.trim()
};

class Profile extends React.Component {

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
            dummy: ''
        };

        this.madeChildren = {
            User: null
        };
        Object.keys(props.pcbMade.children).map(c=>{
            const name = props.pcbMade.children[c].component;

            this.madeChildren[c] = require('../../')[name].Component;
        });

        this.handleClick = ::this.handleClick;
    }

    handleLogOut = () => {
        this.props.logOut();
    };

    async handleClick(e) {
        if(!this.props.disabled){
            await this.props.defaultClick(e);
            await this.props.click(e);
        }
    };

    render() {
        const {props, state, handleClick, handleLogOut} = this;
        const {className, rootClass,  pcb, pcbMade} = props;
        const {User} = this.madeChildren;
        const {dummy} = state;
        const mainClass = 'c-profile';

        return (
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} onClick={handleClick}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <User
                        core={{pcb, id: pcbMade.children['User'].id, component: pcbMade.children['User'].component}}
                        rootClass={`user`}
                    />
                    <div className={`off`}>
                        <div className={`off-btn`} onClick={handleLogOut}>
                            <i className="material-icons">
                                exit_to_app
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentWillUnmount(){
        this.props.deleteComponent()
    }
}

Profile.propTypes = {
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

    const Parent = props.pcbMade.relations.Parent;

    const actions = require('../../index')[Parent.component].actions;
    let logOut = ()=>{};

    if(actions){
        logOut = actions.logOut;
    }

    return bindActionCreators({
        createItem: () => createItem(),
        defaultClick: (e) => flagHandle(cId, 'toggle', e.target.value),
        // mouseOver: () => flagHandle(cId, 'hover', true),
        // mouseOut: () => flagHandle(cId, 'hover', false),
        logOut: () => logOut(Parent.id),
        deleteComponent: () => deleteItem(cId),
        valueChange: (value) => valueChange(cId, value)
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(Profile);
