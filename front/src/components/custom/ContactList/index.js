import React from 'react';
import ContactList from './ContactList';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ContactList.scss';

export const componentName = 'ContactList';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><ContactList/></Core>)
    }
}

export default {
    Component,
    actions,
    types: TYPES
}