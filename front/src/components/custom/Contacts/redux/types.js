import {actionTemplate} from '../../../../redux/common';

export const name = 'contacts';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    ITEM_CREATE: "ITEM_CREATE",
    ITEM_CREATE_COMPLETE: "ITEM_CREATE_COMPLETE",
    ITEM_DELETE: "ITEM_DELETE",
    ITEM_DELETE_COMPLETE: "ITEM_DELETE_COMPLETE",
    CONTACT_CHOSE: "CONTACT_CHOSE",
    ITEM_INITIALIZE: "ITEM_INITIALIZE",
    LENGTH_PLUS: "LENGTH_PLUS"
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
