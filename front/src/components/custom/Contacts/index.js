import React from 'react';
import Contacts from './Contacts';
import Core from '../../../common/core';
import actions from './redux/actions';
import TYPES from './redux/types';

import './Contacts.scss';

export default {
    Component : (props) => <Core {...props}><Contacts/></Core>,
    actions,
    types: TYPES
}