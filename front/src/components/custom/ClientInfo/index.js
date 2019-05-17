import React from 'react';
import ClientInfo from './ClientInfo';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ClientInfo.scss';

export const componentName = 'ClientInfo';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><ClientInfo/></Core>)
    }
}

export default {
    Component,
    actions,
    types: TYPES
}