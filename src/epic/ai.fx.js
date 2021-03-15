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
        // throw new Error(message.red);
    }
};
const fxContinue = (condition, executor) => {
    if (fxCond(condition) && U.isFunction(executor)) {
        return executor();
    }
};
const sortString = (left = "", right = "", asc = true) => {
    const minLen = Math.max(left.length, right.length);
    let order = 0;
    for (let idx = 0; idx < minLen; idx++) {
        let leftCode = left.charCodeAt(idx);
        let rightCode = right.charCodeAt(idx);
        // 空白的处理
        if (leftCode !== rightCode) {
            // 修正长度不等的时候的基础算法
            if (isNaN(leftCode)) leftCode = 0;
            if (isNaN(rightCode)) rightCode = 0;
            if (asc) {
                order = leftCode - rightCode;
            } else {
                order = rightCode - leftCode;
            }
            break;
        }
    }
    return order;
};

const fxSorter = (input = {}) => {
    const normalized = {};
    const keys = Object.keys(input).sort((left, right) => sortString(left, right, true));
    keys.forEach(key => normalized[key] = input[key]);
    return normalized;
};
module.exports = {
    fxSorter,
    fxTerminal,
    fxContinue,
    fxCond
};
