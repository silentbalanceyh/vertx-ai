const Fx = require('./ai.fx');
const It = require('./ai.collection');
const E = require('./ai.error');
const Log = require('./ai.log');
const U = require('underscore');
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
    It.itArray(required, (each) => Fx.fxTerminal(
        1 < each.length && (!($keys.contains(each[0]) || $keys.contains(each[1]))),
        E.fn10006(each)));
    return config;
};
const formatArgs = (args = {}, pairs = []) => {
    const actual = {};
    pairs.forEach(item => Fx.fxContinue(U.isArray(item), () => {
        const arg0 = item[0];
        const arg1 = item[1];
        let finalKey = arg0.length > arg1.length ? arg0 : arg1;
        finalKey = finalKey.toString().replace(/-/g, '');
        const dft = item[2];
        It.itObject(args, (key, value) => Fx.fxContinue(arg0 === key || arg1 === key, () => {
            actual[finalKey] = value;
        }));
        Fx.fxContinue(!args.hasOwnProperty(arg0) && !args.hasOwnProperty(arg1) && !!dft, () => {
            actual[finalKey] = dft;
        });
    }));
    Log.info(`命令参数：\n${JSON.stringify(actual, null, 4).blue}`);
    return actual;
};
module.exports = {
    readArgs,
    formatArgs
};