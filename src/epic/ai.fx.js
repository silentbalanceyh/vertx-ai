const U = require('underscore');
const Log = require('./ai.log');
const fxCond = (arg) => {
    if (U.isFunction(arg)) {
        arg = arg();
    }
    return arg;
};
const fxTerminal = (condition, message) => {
    if (fxCond(condition)) {
        if (message) {
            if ("string" !== message) {
                message = message.toString();
            }
        }
        Log.error(message);
        throw new Error(message.red);
    }
};
const fxContinue = (condition, executor) => {
    if (fxCond(condition) && U.isFunction(executor)) {
        return executor();
    }
};
module.exports = {
    fxTerminal,
    fxContinue,
    fxCond
};
