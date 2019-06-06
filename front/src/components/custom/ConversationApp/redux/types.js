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
    LENGTH_PLUS: "LENGTH_PLUS",
    /**App*/
    APP_AUTHORIZATION_BEGIN: "APP_AUTHORIZATION_BEGIN",
    APP_AUTHORIZATION_END: "APP_AUTHORIZATION_END",
    APP_LOGIN_BEGIN: "APP_LOGIN_BEGIN",
    APP_LOGIN_END: "APP_LOGIN_END",
    APP_LOGIN_ERROR: "APP_LOGIN_ERROR",
    APP_VIEW_LOGIN: "APP_VIEW_LOGIN",
    APP_VIEW_MAIN: "APP_VIEW_MAIN",
    APP_LOGOUT_BEGIN: "APP_LOGOUT_BEGIN",
    APP_LOGOUT_END: "APP_LOGOUT_END",
    APP_STAGE_PREPARED: "APP_STAGE_PREPARED",
    APP_STAGE_CONNECTING: "APP_STAGE_CONNECTING",
    APP_STAGE_READY: "APP_STAGE_READY",
    APP_STAGE_DESTROY: "APP_STAGE_DESTROY",
    APP_SERVER_PREPARE: "APP_SERVER_PREPARE",
    APP_SERVER_DESTROY: "APP_SERVER_DESTROY",
    APP_SERVER_OFF: "APP_SERVER_OFF",
    APP_SERVER_ON: "APP_SERVER_ON",
    APP_SERVER_CONNECTION_ON: "APP_SERVER_CONNECTION_ON",
    APP_SERVER_CONNECTION_OFF: "APP_SERVER_CONNECTION_OFF",
    APP_CHANNEL_ON: "APP_CHANNEL_ON",
    APP_CHANNEL_OFF: "APP_CHANNEL_OFF",
    APP_SERVER_CONNECTION_TRY: "APP_SERVER_CONNECTION_TRY",
    APP_DISCONNECT_TRY: "APP_DISCONNECT_TRY",
    APP_DISCONNECT_ALLOW: "APP_DISCONNECT_ALLOW",
    APP_USER_INFO: "APP_USER_INFO",
    APP_USER_INFO_COMPLETE: "APP_USER_INFO_COMPLETE",
    APP_USER_CONTACTS: "APP_USER_CONTACTS",
    APP_USER_CONTACTS_COMPLETE: "APP_USER_CONTACTS_COMPLETE",
    APP_USER_CONVERSATIONS: "APP_USER_CONVERSATIONS",
    APP_USER_CONVERSATIONS_COMPLETE: "APP_USER_CONVERSATIONS_COMPLETE",
    APP_CONVERSATION_GET: "APP_CONVERSATION_GET",
    APP_CONVERSATION_GET_COMPLETE: "APP_CONVERSATION_GET_COMPLETE",
    APP_CONVERSATION_MESSAGES_SET: "APP_CONVERSATION_MESSAGES_SET",
    CHANNEL_APP_CONNECT_FINAL: "CHANNEL_APP_CONNECT_FINAL",
    APP_CLEAR: "APP_CLEAR",
    DUMMY: "DUMMY",
    /**Message**/
    MESSAGE_SENDING_BEGIN: "MESSAGE_SENDING_BEGIN",
    MESSAGE_SENDING_FINISHED: "MESSAGE_SENDING_FINISHED",
    /**Message**/
    /**Channel**/
    /**Channel**/
    CHANNEL_APP_CONNECT: "CHANNEL_APP_CONNECT",
    CHANNEL_CHAT_SEND: "CHANNEL_CHAT_SEND",
    CHANNEL_CONVERSATION_START: "CHANNEL_CONVERSATION_START",
    CHANNEL_CONVERSATION_END: "CHANNEL_CONVERSATION_END",
    RESULT: "RESULT",
    PARTICIPANT_ID_SET: "PARTICIPANT_ID_SET",
    /**Event Manager*/
    EVENT_SEND: "EVENT_SEND",
    APP_EVENT_MANAGER: "APP_EVENT_MANAGER",
    APP_EVENT_ARRAYS: "APP_EVENT_ARRAYS",
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
