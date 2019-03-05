import {actionTemplate} from '../../../../redux/reducers';

const defaultTypes = {
    INITIALIZE: "INITIALIZE",
    FLAGS: "FLAGS",
    FLAGS_COMPLETE: "FLAGS_COMPLETE",
    CREATE_ITEM: "CREATE_ITEM",
    DELETE_ITEM: "DELETE_ITEM"
};

const _sequence = ["name","root"];

const _template = {
  name: "MSG",
  root: {...defaultTypes}
};

const foo = (() =>{
    return actionTemplate(_sequence, _template, '__');
})();

export const TYPES = foo;
