import React from 'react';
import Button from './Button';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';

import './Button.scss';

export const componentName = 'Button';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><Button/></Core>)
    }
}

export default {
    Component,
    actions
}