import React from 'react';
import Button from './Button';
import Core from '../../../common/core';
import actions from './redux/actions';

import './Button.scss';

export default {
    Component : (props)=> {
        console.log({...props});
        return (<Core {...props}><Button {...props}/></Core>)
    },
    actions
}