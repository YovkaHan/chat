import React from 'react';
import Message from './Message';
import Core from '../../../common/core';
import actions from './redux/actions';

import './Message.scss';

export default {
    Component : (props)=> <Core {...props}><Message/></Core>,
    actions
}