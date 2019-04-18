import React from 'react';
import Example from './Example';  /*Исходный код комопнента*/
import Core from '../../../common/core';
import actions from './redux/actions';

import './Example.scss';  /*Стили компонента*/

export const componentName = 'Example'; /*Используется для проброса имени компонента в связаные с ним файлы*/

export default {
    Component : (props)=> {
        return (<Core {...props}><Example/></Core>)
    },
    actions /*для удобства и унификации*/
}

/**
 * Компонент Example
 *
 * {name} = Имя компонента (Example)
 *
 * -redux
 *   -actions.js
 *   -reducer.js
 *   -sagas.js
 *   -types.js
 * {name}.js
 * {name}.scss
 * index.js
 *
 * Копирование :
 *  1) Скопировать все файлы с переименованием главной папки
 *  2) Переименовать файлы в главной папке
 *  3) Переназначить переменные и пути в index файле
 *  4) В файле "Исходного кода компонента" переименовать переменные (если не было сделано автоматически)
 *  5) В redux/types.js назначить имя для генерации idшников в сторе
 *  6) Подключить редюсер в рутовый редюсер
 *  7) Подключить сагу в рутовую сагу
 *  8) Пробросить путь к компоненту в index файле компонентов
 *  9) Создать конфигурацию комопонента в дереве
 *

 * */