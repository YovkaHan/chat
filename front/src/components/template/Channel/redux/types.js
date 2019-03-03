import {actionTemplate} from '../../../../redux/reducers';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    RESULT: "RESULT",
    CHANNEL_START: "CHANNEL_START",  /** Подготовка к открытию канала */
    CHANNEL_STOP: "CHANNEL_STOP", /** Подготовка к закрытию канала */
    CHANNEL_ON: "CHANNEL_ON",  /** Открытие канала */
    CHANNEL_OFF: "CHANNEL_OFF", /** Закрытие канала */
    CHANNEL_EMIT: "CHANNEL_EMIT",
    CHANNEL_CHAT_CONNECT: "CHANNEL_CHAT_CONNECT",
    CHANNEL_CHAT_SEND: "CHANNEL_CHAT_SEND",
    CHANNEL_EMIT_COMPLETED: "CHANNEL_EMIT_COMPLETED",
    SERVER_ON: "SERVER_ON",
    SERVER_OFF: "SERVER_OFF"
};

const _sequence = ["name","root"];

const _template = {
  name: "C_CHANNEL",
  root: {...defaultTypes}
};

const foo = (() =>{
    return actionTemplate(_sequence, _template, '__');
})();

export const TYPES = foo;
