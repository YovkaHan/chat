import {actionTemplate} from '../../../../redux/common';

export const name = 'chat';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    CHANGE: "CHANGE",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    ITEM_CREATE: "ITEM_CREATE",
    ITEM_CREATE_COMPLETE: "ITEM_CREATE_COMPLETE",
    ITEM_DELETE: "ITEM_DELETE",
    ITEM_DELETE_COMPLETE: "ITEM_DELETE_COMPLETE",
    MSG_MAKE: "MSG_MAKE",
    MSG_MAKE_COMPLETE: "MSG_MAKE_COMPLETE",
    CHANNEL_START: "CHANNEL_START",
    CHANNEL_STOP: "CHANNEL_STOP",
    SERVER_OFF: "SERVER_OFF",
    SERVER_ON: "SERVER_ON",
    CHANNEL_CHAT_CONNECT: "CHANNEL_CHAT_CONNECT",
    CHANNEL_CHAT_SEND: "CHANNEL_CHAT_SEND",
    CHANNEL_ON: "CHANNEL_ON",
    CHANNEL_OFF: "CHANNEL_OFF",
    RESULT: "RESULT",

};

const _sequence = ["name","root"];

const _template = {
    name: name.toUpperCase(),
    root: {...defaultTypes}
};

const foo = (() =>{
    return actionTemplate(_sequence, _template, '__');
})();

export const TYPES = foo;
