import React from 'react';
import Profile from './Profile';  /*Исходный код комопнента*/
import Core from '../../../common/core';
import actions from './redux/actions';

import './Profile.scss';  /*Стили компонента*/

export const componentName = 'Profile'; /*Используется для проброса имени компонента в связаные с ним файлы*/

export default {
    Component : (props)=> {
        return (<Core {...props}><Profile/></Core>)
    },
    actions /*для удобства и унификации*/
}
