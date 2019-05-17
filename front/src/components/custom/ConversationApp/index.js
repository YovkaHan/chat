import React from 'react';
import ConversationApp from './ConversationApp';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ConversationApp.scss';

export const componentName = 'ConversationApp';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><ConversationApp/></Core>)
    }
}

export default {
    Component,
    actions,
    types: TYPES
}