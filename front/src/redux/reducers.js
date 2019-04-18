import {reducer as Core} from '../common/core';
import Example from '../components/custom/Example/redux/reducer';
import InputArea from '../components/custom/InputArea/redux/reducer';
import Message from '../components/custom/Message/redux/reducer';
import Button from '../components/custom/Button/redux/reducer';
import MessageInput from '../components/custom/MessageInput/redux/reducer';
import MessageList from '../components/custom/MessageList/redux/reducer';
import Chat from '../components/custom/Chat/redux/reducer';
import ConversationApp from '../components/custom/ConversationApp/redux/reducer';
import ClientInfo from '../components/custom/ClientInfo/redux/reducer';
import Profile from '../components/custom/Profile/redux/reducer';
import {combineReducers} from 'redux';

export default {
    Components: combineReducers({
        Core: Core(),
        Example: Example(),
        Message: Message(),
        Button: Button(),
        InputArea: InputArea(),
        MessageInput: MessageInput(),
        MessageList: MessageList(),
        Chat: Chat(),
        ConversationApp: ConversationApp(),
        ClientInfo: ClientInfo(),
        Profile: Profile()
    })
};
