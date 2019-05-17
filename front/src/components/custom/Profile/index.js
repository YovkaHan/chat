import React from 'react';
import Profile from './Profile';  /*Исходный код комопнента*/
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';

import './Profile.scss';  /*Стили компонента*/

export const componentName = 'Profile'; /*Используется для проброса имени компонента в связаные с ним файлы*/

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><Profile/></Core>)
    }
}


export default {
    Component,
    actions /*для удобства и унификации*/
}
