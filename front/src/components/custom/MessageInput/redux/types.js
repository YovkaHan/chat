import {actionTemplate} from '../../../../redux/common';

export const name = 'msg_inpt';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    CHANGE: "CHANGE",
    CHANGE_COMPLETE: "CHANGE_COMPLETE"
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
