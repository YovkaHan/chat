import React from 'react';
import {Button, Lamp, Panel, Channel, MyPanel, InputArea, MessageInput, Message} from '../../';
import {pcbGenerate} from '../../../common/pcb';

const pcbTemplate = {
    Button0: {id: 'b0', component: 'Button'},
    Button1: {id: 'b1', component: 'Button'},
    Button2: {id: 'b2', component: 'Button'},
    Button3: {id: 'b3', component: 'Button'},
    Lamp0: {id: 'l0', component: 'Lamp'},
    Lamp1: {id: 'l1', component: 'Lamp'},
    Panel0: {
        id: 'pl0',
        component: 'Panel',
        config: {
            channels: [
                {id: 'ch0', component: 'Channel'},
                {id: 'ch1', component: 'Channel'}
            ]
        }
    },
    Channel0: {
        id: 'ch0',
        component: 'Channel',
        relations: {
            Connect: {name: 'Button0'},
            Lamp: {name: 'Lamp0'},
            Message: {name: 'Button1'}
        },
        config: {from: 'ch0', to: 'ch1'}
    },
    InputArea0: {
        id: 'iA0',
        component: 'InputArea',
        config: {from: 'ch1', to: 'ch0'}
    },
    MessageInput0: {
        id: 'msgI0',
        children:  [
            {alias: 'InputArea', name: 'InputArea0'},
            {alias: 'Send', name: 'Button0'}
        ],
    },
    List0: {
        id: 'list0'
    },
    MessageList0: {
        id: 'msgL0',
        children:  [
            {alias: 'Messages', name: 'List'}
            ]
    }
};

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
                    <MessageInput pcb={this.pcb.make('MessageInput0')}/>
                    {/*<MyPanel pcb={this.pcb}/>*/}
                    <Message pcb={this.pcb}/>
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
 * */