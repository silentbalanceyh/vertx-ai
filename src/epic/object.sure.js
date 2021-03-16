const fs = require('fs');
const U = require('underscore');
const Immutable = require('immutable');
const E = require('./object.error');
const Log = require('./ai.log');

const isFile = (path, file = true) => {
    let existing = fs.existsSync(path);
    if (existing) {
        const etat = fs.statSync(path);
        if (file) {
            return etat.isFile();
        } else {
            return etat.isDirectory();
        }
    } else {
        return false;
    }
};
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
    Valid: (arg) => !!arg,
    File: (arg) => isFile(arg),
    Directory: (arg) => isFile(arg, false),
    Exist: (arg) => fs.existsSync(arg),
    Empty: (arg) => {
        const etat = fs.statSync(arg);
        if (etat.isFile()) {
            return false;
        }
        const children = fs.readdirSync(arg);
        return 0 === children.length;
    }
};
const EFUNS = {
    Function: E.fn10001,
    String: E.fn10001,
    JString: E.fn10001,
    Valid: E.fn10001,
    Enum: E.fn10002,
    File: E.fn10007,
    Directory: E.fn10008,
    Exist: E.fn10009,
    Empty: E.fn10023,
};
const _sure = (type) => (arg, config) => {
    const check = FUNS[type];
    const message = EFUNS[type](arg, type, config);
    const checked = !check(arg, config);
    if (checked) {
        Log.error(message);
    }
};
module.exports = {
    cxFunction: _sure('Function'),
    cxString: _sure('String'),
    cxJString: _sure('JString'),
    cxEnum: _sure('Enum'),
    cxValid: _sure('Valid'),
    cxFile: _sure('File'),
    cxExist: _sure('Exist'),
    cxDirectory: _sure('Directory'),
    cxEmpty: _sure('Empty')
};