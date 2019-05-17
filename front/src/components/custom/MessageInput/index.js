import React from 'react';
import MessageInput from './MessageInput';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';

import './MessageInput.scss';

export const componentName = 'MessageInput';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><MessageInput/></Core>)
    }
}

export default {
    Component,
    actions
}