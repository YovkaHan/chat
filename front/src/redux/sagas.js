import {all} from 'redux-saga/effects';

import Button from '../components/custom/Button/redux/sagas';
import Lamp from '../components/template/Lamp/redux/sagas';
import Panel from '../components/template/Panel/redux/sagas';
import MessageInput from '../components/custom/MessageInput/redux/sagas';
import Message from "../components/custom/Message/redux/sagas";

export default function* rootSaga() {
    const sagas = [...Button, ...Message, ...Lamp, ...Panel, ...MessageInput];

    yield all(sagas)
}