import React from 'react';
import ConversationList from './ConversationList';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ConversationList.scss';

export const componentName = 'ConversationList';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><ConversationList/></Core>)
    }
}

export default {
    Component,
    actions,
    types: TYPES
}