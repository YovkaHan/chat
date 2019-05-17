import React from 'react';
import MessageList from './MessageList';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';

import './MessageList.scss';

export const componentName = 'MessageList';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><MessageList/></Core>)
    }
}

export default {
    Component,
    actions
}