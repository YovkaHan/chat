import React from 'react';
import * as R from 'ramda';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {initItem, deleteItem} from "./redux/actions";

const innerClass = (sufix, mainClass, rootClass) => {
    return `${mainClass}__${sufix}${rootClass ? ' '+rootClass+'__'+sufix : ''}`.trim()
};

class ContactList extends React.Component {

    static defaultProps = {
        className: '',
        rootClass: '',
        list: {}
    };

    constructor(props){
        super(props);

        this.state = {

        };

        this.madeRelations = {
            Contact: null
        };
        Object.keys(props.pcbMade.relations).map(c=>{
            const name = props.pcbMade.relations[c].component;

            this.madeRelations[c] = require('../../')[name].Component;
        });

    }

    // shouldComponentUpdate(props){
    //     if(props.updateAllow){
    //         return false
    //     }else {
    //         return true;
    //     }
    // }

    render(){
        const {props, state, madeRelations} = this;
        const {Contact} = madeRelations;
        const {pcbMade, flags, className, rootClass, pcb, list, style} = props;
        const mainClass = 'c-contacts';

        return(
            <div className={`${mainClass} ${className} ${rootClass}`.trim()} style={style}>
                <div className={innerClass('content', mainClass, rootClass)}>
                    <div className={`panel`}>
                        <input type="text" className={`panel__item input-search`}/>
                        <div className={`panel__item close-btn`}>
                            <i className={`icon material-icons`}>
                                close
                            </i>
                        </div>
                    </div>
                    <div className={`list`}>
                        {
                            Object.keys(list).map(key => (
                                <Contact
                                    core={{pcb, template: pcbMade.relations['Contact'].template, component: pcbMade.relations['Contact'].component}}
                                    key={key}
                                    client={list[key]}
                                    rootClass={`contact`}
                                    className={rootClass+'__item'}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
    componentWillUnmount(){
        this.props.deleteComponent()
    }
}
ContactList.propTypes = {
    className: PropTypes.string,
    rootClass: PropTypes.string,
    pcb: PropTypes.object,
    list: PropTypes.object,
    updateAllow: PropTypes.bool
};


const mapStateToProps = (state, props) => {
    const cId = props.pcbMade.id;

    const Parent = props.pcbMade.relations.Parent;
    const _object = state.Components.ContactList[cId];
    const parentObject = state.Components[Parent.component][Parent.id];

    if(_object) {
        return ({
            flags: _object.flags,
            updateAllow: _object.flags.update,
            list: R.clone(parentObject.contacts.data)
        })
    } else {
        return {};
    }
};

const mapDispatchers = (dispatch, props) => {
    const cId = props.pcbMade.id;

    return bindActionCreators({
        // initialize: (pcb) => initItem(cId, pcb),
        deleteComponent: () => deleteItem(cId),
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchers)(ContactList);