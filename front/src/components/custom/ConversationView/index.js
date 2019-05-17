import React from 'react';
import ConversationView from './ConversationView';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ConversationView.scss';

export const componentName = 'ConversationView';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><ConversationView/></Core>)
    }
}

export default {
    Component,
    actions,
    types: TYPES
}