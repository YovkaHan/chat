import {reducer as Core} from '../common/core';
// import Lamp from '../components/custom/Button/redux/reducer';
// import Panel from '../components/template/Panel/redux/reducer';
// import Channel from '../components/template/Channel/redux/reducer';
import InputArea from '../components/custom/InputArea/redux/reducer';
import Message from '../components/custom/Message/redux/reducer';
import Button from '../components/custom/Button/redux/reducer';
import MessageInput from '../components/custom/MessageInput/redux/reducer';
import MessageList from '../components/custom/MessageList/redux/reducer'
import {combineReducers} from 'redux';
import produce from "immer";

export default {
    Components: combineReducers({
        Core: Core(),
        Message: Message(),
        Button: Button(),
        // Lamp: Lamp(),
        // Channel: Channel(),
        // Panel: Panel(),
        InputArea: InputArea(),
        MessageInput: MessageInput(),
        MessageList: MessageList()
    })
};
