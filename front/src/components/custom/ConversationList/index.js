import React from 'react';
import ConversationList from './ConversationList';
import Core from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ConversationList.scss';

export const componentName = 'ConversationList';

export default {
    Component : (props)=> {
        return (<Core {...props}><ConversationList/></Core>)
    },
    actions,
    types: TYPES
}