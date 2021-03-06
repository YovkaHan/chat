import {all} from 'redux-saga/effects';

import Example from '../components/custom/Example/redux/sagas';
import Button from '../components/custom/Button/redux/sagas';
import Lamp from '../components/template/Lamp/redux/sagas';
import Panel from '../components/template/Panel/redux/sagas';
import MessageInput from '../components/custom/MessageInput/redux/sagas';
import MessageList from '../components/custom/MessageList/redux/sagas';
import InputArea from '../components/custom/InputArea/redux/sagas';
import Message from '../components/custom/Message/redux/sagas';
import Chat from '../components/custom/Chat/redux/sagas';
import ClientInfo from '../components/custom/ClientInfo/redux/sagas';
import ContactList from '../components/custom/ContactList/redux/sagas';
import ConversationList from '../components/custom/ConversationList/redux/sagas';
import ConversationView from '../components/custom/ConversationView/redux/sagas';
import ConversationApp from '../components/custom/ConversationApp/redux/sagas';
import Profile from '../components/custom/Profile/redux/sagas';

export default function* rootSaga() {
    const sagas = [
        ...Button,
        ...Chat,
        ...ClientInfo,
        ...ContactList,
        ...ConversationList,
        ...ConversationView,
        ...ConversationApp,
        ...Example,
        ...InputArea,
        ...Lamp,
        ...Message,
        ...MessageInput,
        ...MessageList,
        ...Panel,
        ...Profile
    ];

    yield all(sagas)
}