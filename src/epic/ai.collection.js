const Log = require('./ai.log');
const U = require('underscore');
const inflect = require('i')();

const _eachExec = (executor, callback, method = "") => {
    if (U.isFunction(executor)) {
        return callback();
    } else {
        Log.warn(`[Zero AI] (${method}) The 'executor' argument must be function, but now ${executor}`);
    }
};

const itPair = (first = [], second = [], executor = () => {
}) => {
    _eachExec(executor, () => {
        const length = first.length > second.length ? first.length : second.length;
        for (let idx = 0; idx < length; idx++) {
            const firstArg = first[idx];
            const secondArg = second[idx];
            executor(firstArg, secondArg, idx);
        }
    }, "itPair")
};

const itObject = (object = {}, executor = () => {
}) => {
    const target = {};
    _eachExec(executor, () => {
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                const value = object[key];
                target[key] = executor(key, value)
            }
        }
    }, "itObject");
    return target;
};

const itArray = (array = [], executor = () => {
}) => {
    const target = [];
    _eachExec(executor, () => {
        array.forEach((item, index) => {
            const each = executor(item, index);
            target.push(each);
        })
    }, "itArray");
    return target;
};

const itCompress = (object = {}, prefix = "") => {
    const items = [];
    const result = {};
    itObject(object, (key, value) => {
        if (key.startsWith(prefix)) {
            items.push(value);
        } else {
            result[key] = value;
        }
    });
    if (0 < items.length) {
        const prefixes = inflect.pluralize(prefix);
        result[prefixes] = items;
    }
    return result;
};
module.exports = {
    itPair,
    itCompress,
    itObject,
    itArray
};