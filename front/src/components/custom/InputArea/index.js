import React from 'react';
import InputArea from './InputArea';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';

import './InputArea.scss';

export const componentName = 'InputArea';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><InputArea/></Core>)
    }
}

export default {
    Component,
    actions
}