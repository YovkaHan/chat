import {actionTemplate} from '../../../../redux/common';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    INITIALIZE_COMPLETE: "INITIALIZE_COMPLETE",

};

const _sequence = ["name","root"];

const _template = {
  name: "PANEL",
  root: {...defaultTypes}
};

const foo = (() =>{
    return actionTemplate(_sequence, _template, '__');
})();

export const TYPES = foo;
