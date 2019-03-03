import React from 'react';
import {Button, Lamp, Panel, Channel, MyPanel} from '../../';
import {pcbGenerate} from '../../../common/pcb';

const pcbTemplate = {
    Button0: {id: 'b0'},
    Button1: {id: 'b1'},
    Button2: {id: 'b2'},
    Button3: {id: 'b3'},
    Lamp0: {id: 'l0'},
    Lamp1: {id: 'l1'},
    Panel0: {
        id: 'pl0',
        config: {
            channels: [
                {id: 'ch0', component: 'Channel'},
                {id: 'ch1', component: 'Channel'}
            ]
        }
    },
    Channel0: {
        id: 'ch0',
        relations: {
            Connect: {name: 'Button0'},
            Lamp: {name: 'Lamp0'},
            Message: {name: 'Button1'}
        },
        config: {from: 'ch0', to: 'ch1'}
    },
    Channel1: {
        id: 'ch1',
        relations: {
            Connect: {name: 'Button0'},
            Lamp: {name: 'Lamp0'},
            Message: {name: 'Button1'}
        },
        config: {from: 'ch1', to: 'ch0'}
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
                <div className={`panel-combiner`}>
                   <MyPanel pcb={this.pcb}/>
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