const Log = require('./ai.log');
const U = require('underscore');
const Immutable = require('immutable');
const Fx = require('./ai.fx');
const E = require('./ai.error');
const FUNS = {
    Function: U.isFunction,
    String: arg => "string" === typeof arg,
    JString: arg => {
        try {
            JSON.parse(arg);
            return true;
        } catch (e) {
            return false;
        }
    },
    Enum: (arg, expected = []) => {
        expected = !U.isArray(expected) ? [] : expected;
        const $expected = Immutable.fromJS(expected);
        return $expected.contains(arg);
    },
    Valid: (arg) => !!arg
};
const EFUNS = {
    Function: E.fn10001,
    String: E.fn10001,
    JString: E.fn10001,
    Valid: E.fn10001,
    Enum: E.fn10002,
};
const _sure = (type) => (arg, config) => {
    const check = FUNS[type];
    const message = EFUNS[type](arg, type, config);
    const checked = !check(arg, config);
    Fx.fxTerminal(checked, message);
};
module.exports = {
    cxFunction: _sure('Function'),
    cxString: _sure('String'),
    cxJString: _sure('JString'),
    cxEnum: _sure('Enum'),
    cxValid: _sure('Valid')
};