import {actionTemplate} from '../../../../redux/common';

export const name = 'conversationApp';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    CHANGE: "CHANGE",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    ITEM_CREATE: "ITEM_CREATE",
    ITEM_CREATE_COMPLETE: "ITEM_CREATE_COMPLETE",
    ITEM_DELETE: "ITEM_DELETE",
    ITEM_DELETE_COMPLETE: "ITEM_DELETE_COMPLETE",
    /**App*/
    APP_AUTHORIZATION_BEGIN: "APP_AUTHORIZATION_BEGIN",
    APP_AUTHORIZATION_END: "APP_AUTHORIZATION_END",
    APP_LOGIN_BEGIN: "APP_LOGIN_BEGIN",
    APP_LOGIN_END: "APP_LOGIN_END",
    APP_VIEW_LOGIN: "APP_VIEW_LOGIN",
    APP_VIEW_MAIN: "APP_VIEW_MAIN",
    APP_LOGOUT_BEGIN: "APP_LOGOUT_BEGIN",
    APP_LOGOUT_END: "APP_LOGOUT_END",
    /**Message**/
    MESSAGE_MAKING_BEGIN: "MESSAGE_MAKING_BEGIN",
    MESSAGE_MAKING_FINISHED: "MESSAGE_MAKING_FINISHED",
    MESSAGE_SENDING_BEGIN: "MESSAGE_SENDING_BEGIN",
    MESSAGE_SENDING_FINISHED: "MESSAGE_SENDING_FINISHED",
    /**Message**/
    /**Channel**/
    CHANNEL_START: "CHANNEL_START",
    CHANNEL_STOP: "CHANNEL_STOP",
    CHANNEL_ON: "CHANNEL_ON",
    CHANNEL_OFF: "CHANNEL_OFF",
    /**Channel**/
    SERVER_OFF: "SERVER_OFF",
    SERVER_ON: "SERVER_ON",
    CHAT_READY: "CHAT_READY",
    CHANNEL_APP_CONNECT: "CHANNEL_APP_CONNECT",
    CHANNEL_CHAT_SEND: "CHANNEL_CHAT_SEND",
    CHANNEL_CONVERSATION_START: "CHANNEL_CONVERSATION_START",
    CHANNEL_CONVERSATION_END: "CHANNEL_CONVERSATION_END",
    RESULT: "RESULT",
    PARTICIPANT_ID_SET: "PARTICIPANT_ID_SET",
    CONNECTION_ON: "CONNECTION_ON",
    CONNECTION_OFF: "CONNECTION_OFF"
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
