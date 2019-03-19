import {all} from 'redux-saga/effects';

import Button from '../components/custom/Button/redux/sagas';
import Lamp from '../components/template/Lamp/redux/sagas';
import Panel from '../components/template/Panel/redux/sagas';
import MessageInput from '../components/custom/MessageInput/redux/sagas';
import MessageList from '../components/custom/MessageList/redux/sagas';
import InputArea from '../components/custom/InputArea/redux/sagas';
import Message from '../components/custom/Message/redux/sagas';
import Contacts from '../components/custom/Contacts/redux/sagas';
import Chat from '../components/custom/Chat/redux/sagas';

export default function* rootSaga() {
    const sagas = [
        ...Button,
        ...Message,
        ...Lamp,
        ...Panel,
        ...MessageInput,
        ...InputArea,
        ...MessageList,
        ...Chat,
        ...Contacts
    ];

    yield all(sagas)
}