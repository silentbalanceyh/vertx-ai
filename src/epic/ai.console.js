const Fx = require('./ai.fx');
const It = require('./ai.collection');
const E = require('./ai.error');
const Immutable = require('immutable');
const readArgs = (required = []) => {
    const arguments = process.argv.splice(3);
    const config = {};
    let key = undefined;
    let value = undefined;
    for (let idx = 0; idx <= arguments.length; idx++) {
        if (0 === idx % 2) {
            key = arguments[idx];
        } else {
            value = arguments[idx];
        }
        if (key && value) {
            config[key] = value;
            key = undefined;
            value = undefined;
        }
    }
    const $keys = Immutable.fromJS(Object.keys(config));
    It.itArray(required, (each) => Fx.fxTerminal(!$keys.contains(each), E.fn10006(each)));
    return config;
};
module.exports = {
    readArgs
};