import React from 'react';
import MessageList from './MessageList';
import Core from '../../../common/core';
import actions from './redux/actions';

import './MessageList.scss';

export default {
    Component : (props) => <Core {...props}><MessageList/></Core>,
    actions
}