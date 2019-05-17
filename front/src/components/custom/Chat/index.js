import React from 'react';
import Chat from './Chat';
import Core, {rootIdGenerator} from '../../../common/core';
import actions from './redux/actions';
import {TYPES} from './redux/types';

import './Chat.scss';

export const componentName = 'Chat';

class Component extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            coreId: rootIdGenerator.create()
        }
    }
    render(){
        return(<Core {...this.props} coreId={this.state.coreId}><Chat/></Core>)
    }
}

export default {
    Component,
    actions,
    types: TYPES
}

/**
 *
 * Компонент Chat
 *
 * Инициализация:
 *  Инициализация состовных компонентов по дереву
 *  Канала связи с центральным узлом
 *      Поднятие канала связи
 *      Проверка сервера
 *      Определение обработчиков disconnect, reconnect
 *      Определение обработчика "подключения к чату"
 *      Определение обработчика "отправки сообщения"
 *      Завершение определения всех орбработчиков
 *      Определение дальнейших деректив после того как обработчик отработает
 *
 *      Операции при завершении канала связи
 * */