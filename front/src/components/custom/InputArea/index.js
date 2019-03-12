import React from 'react';
import InputArea from './InputArea';
import Core from '../../../common/core';
import actions from './redux/actions';

import './InputArea.scss';

export default {
    Component : (props)=> (<Core {...props}><InputArea {...props}/></Core>),
    actions
}