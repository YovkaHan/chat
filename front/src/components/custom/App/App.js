import React from 'react';
import {Button, MessageInput, Message, MessageList, Chat, ConversationApp} from '../../';
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
                    {/*<Chat.Component*/}
                        {/*className={`clientA`}*/}
                        {/*core={{pcb: this.pcb, id: 'chat0', component: 'Chat'}}*/}
                        {/*from={'C'}*/}
                        {/*to={'D'}*/}
                    {/*/>*/}
                    <ConversationApp.Component
                        className={`clientB`}
                        core={{pcb: this.pcb, id: 'convApp0', component: 'ConversationApp'}}
                    />
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

/**Концепция
 *
 * Приложение делится на Бековую и Фронтовую части.
 *
 * Бековая часть состоит из Сервера и БД
 * Сервер : часть транспортного протокола, сокеты, взаимодействие с бд, взаимодействие с приложением
 * БД : клиенты, комнаты
 *
 * По хорошему приложение Чата должно делится на Комнаты, но в данном случае будет 1 комната.
 *
 * Приложение
 * - Вход(регистрация клиента) / Выход
 * - Список комнат
 * --Список участников комнаты (общее, онлайн)
 *
 * */