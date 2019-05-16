import React from 'react';
import ConversationView from './ConversationView';
import Core from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ConversationView.scss';

export const componentName = 'ConversationView';

export default {
    Component : (props)=> {
        return (<Core {...props}><ConversationView/></Core>)
    },
    actions,
    types: TYPES
}