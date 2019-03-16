import React from 'react';
import Chat from './Chat';
import Core from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './Chat.scss';

export default {
    Component : (props)=> {
        return (<Core {...props}><Chat/></Core>)
    },
    actions,
    types: TYPES
}