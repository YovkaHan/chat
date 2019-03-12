import React from 'react';
import MessageInput from './MessageInput';
import Core from '../../../common/core';
import actions from './redux/actions';

import './MessageInput.scss';

export default {
    Component : (props)=> (<Core {...props}><MessageInput {...props}/></Core>),
    actions
}