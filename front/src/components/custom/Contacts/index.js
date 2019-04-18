import React from 'react';
import Contacts from './Contacts';
import Core from '../../../common/core';
import actions from './redux/actions';

import './Contacts.scss';

export default {
    Component : (props) => <Core {...props}><Contacts/></Core>,
    actions
}