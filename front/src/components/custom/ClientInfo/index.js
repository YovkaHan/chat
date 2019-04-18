import React from 'react';
import ClientInfo from './ClientInfo';
import Core from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './ClientInfo.scss';

export default {
    Component : (props)=> {
        return (<Core {...props}><ClientInfo/></Core>)
    },
    actions,
    types: TYPES
}