import React from 'react';
import ConversationApp from './ConversationApp';
import Core from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ConversationApp.scss';

export default {
    Component : (props)=> {
        return (<Core {...props}><ConversationApp/></Core>)
    },
    actions,
    types: TYPES
}