import React from 'react';
import ContactList from './ContactList';
import Core from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ContactList.scss';

export const componentName = 'ContactList';

export default {
    Component : (props)=> {
        return (<Core {...props}><ContactList/></Core>)
    },
    actions,
    types: TYPES
}