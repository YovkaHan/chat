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