const Immutable = require('immutable');
const parseApi = (api = "") => {
    if (0 <= api.indexOf(':')) {
        api = api.split(':');
    } else {
        api = ['get', api];
    }
    if (!api[1].startsWith('/')) {
        api[1] = `/` + api[1];
    }
    return {
        method: api[0],
        uri: api[1]
    }
};
const TYPES = [
    "String"
];
const parseLiteral = (value, type = "String") => {
    const $types = Immutable.fromJS(TYPES);
    if ($types.contains(type)) {
        value = `"${value}"`;
    }
    return value;
};
module.exports = {
    parseApi,
    parseLiteral
};