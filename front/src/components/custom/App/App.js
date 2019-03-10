import React from 'react';
import {Button, Message} from '../../';
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
                    {/*<MessageInput pcb={this.pcb} id={'MessageInput0'}/>*/}
                    {/*/!*<MyPanel pcb={this.pcb}/>*!/*/}
                   {/*<MessageList pcb={this.pcb.make('MessageInput0')}/>*/}
                   <Button.Component pcb={this.pcb} template={'Button0'} component={'Button'}/>
                   {/*<Message pcb={this.pcb}/>*/}
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
 *
 * rootClass - дополняющий для компонента класс который дублируется внутрь компонента по древовидной структуре (как mainClass)
 *      (кастомизация и создание нового комонента)
 * className - классическое свойство jsx разметки
 *      (дополнительные стили или состояния)
 *      (для привязки логики)
 *
 *
 * */