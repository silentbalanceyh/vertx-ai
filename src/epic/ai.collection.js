const Log = require('./ai.log');
const Fx = require('./ai.fx');
const U = require('underscore');
const fs = require('fs');
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
    const length = first.length > second.length ? first.length : second.length;
    _eachExec(executor, () => {
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
    _eachExec(executor, () => array.forEach((item, index) => {
        const each = executor(item, index);
        target.push(each);
    }), "itArray");
    return target;
};

const itFileSync = (path = "", callback) => {
    const etat = fs.statSync(path);
    if (etat.isDirectory()) {
        const dir = fs.readdirSync(path);
        itArray(dir, (item) => Fx.fxContinue(!item.startsWith('_') && !item.startsWith('.'), () => {
            let divider = path.endsWith('/') ? '/' : "";
            let hitFile = path + divider + item;
            itFileSync(hitFile, callback);
        }))
    } else {
        callback(path);
    }
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
    Fx.fxContinue(0 < items.length, () => {
        const prefixes = inflect.pluralize(prefix);
        result[prefixes] = items;
    });
    return result;
};
module.exports = {
    itPair,
    itCompress,
    itFileSync,
    itObject,
    itArray
};