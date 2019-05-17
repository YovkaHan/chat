import React from 'react';
import Message from './Message';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';

import './Message.scss';

export const componentName = 'Message';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><Message/></Core>)
    }
}

export default {
    Component,
    actions
}