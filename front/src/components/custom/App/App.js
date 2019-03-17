import React from 'react';
import {Button, MessageInput, Message, MessageList, Chat} from '../../';
import {pcbGenerate} from '../../../common/pcb';
import {pcbTemplate} from '../../../common/appConfig';

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {};
        this.pcb = pcbGenerate(pcbTemplate);
    };

    render() {

        return (
            <React.Fragment>
                <div className={`the-app`}>
                    <Chat.Component rootClass={`a-chat`} core={{pcb: this.pcb, id: 'chat0', component: 'Chat'}}/>
                    <Chat.Component rootClass={`a-chat`} core={{pcb: this.pcb, id: 'chat1', component: 'Chat'}}/>
                </div>
            </React.Fragment>
        )
    }
}

/**
 * Panel - агреггирующий в себе компонент. Содержит в себе Item'ы. Все что находится внутри (фронт) является независимым.
 *
 * Channel - логический компонент. Пробросывает передаваемые child'ы внутрь. Логику передает при помощи предварительных
 * конфигов и договоронностей
 *
 * rootClass - дополняющий для компонента класс который дублируется внутрь компонента по древовидной структуре (как mainClass)
 *      (кастомизация и создание нового комонента)
 * className - классическое свойство jsx разметки
 *      (дополнительные стили или состояния)
 *      (для привязки логики)
 * */

/**1. Отправка сообщения на сервер
 * 2. Получения сервером и отправка ответа о получении
 * */