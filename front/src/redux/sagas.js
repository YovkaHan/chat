import {all} from 'redux-saga/effects';

import Button from '../components/custom/Button/redux/sagas';
import Lamp from '../components/template/Lamp/redux/sagas';
import Panel from '../components/template/Panel/redux/sagas';

export default function* rootSaga() {
    const sagas = [...Button, ...Lamp, ...Panel];

    yield all(sagas)
}