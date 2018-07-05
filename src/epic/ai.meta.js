const program = require('commander');
const U = require('underscore');
const co = require('co');
const Immutable = require('immutable');
const Log = require('./ai.log');
const It = require('./ai.collection');
const Fx = require('./ai.fx');
const E = require('./ai.error');

const executeHeader = () => {
    const appInfo = require('./../../package.json');
    program.allowUnknownOption();
    program.version(appInfo.version);
    Log.info(`Zero AI 代码生成器, ` + 'GitHub : '.bold + `https://github.com/silentbalanceyh/vertx-ui`.blue);
    Log.info(`当前版本: ` + `${appInfo.version}`.red + '  ' + `确认您的Node版本 ( >= 10.x ) 支持ES6.`.yellow);
    Log.info("Zero AI 系统启动......".cyan);
    if (3 > process.argv.length) {
        Log.error("命令缺失，请输入正确的命令！");
    }
};

const _buildOption = (options = []) => {
    let optionStr = "";
    const optionItem = [];
    options.forEach((option, index) => {
        const keys = Object.keys(option);
        const key0 = keys[0].toString();
        const key1 = keys[1].toString();
        const short = key0.length < key1.length ? key0 : key1;
        const long = key0.length > key1.length ? key0 : key1;
        const key = `-${short}, --${long}`;
        const opt = {};
        opt.key = key;
        opt.desc = option[short] ? option[short] : option[long];
        optionItem.push(opt);
        optionStr += key;
        if (index < options.length - 1) {
            optionStr += ' | ';
        }
    });
    return {
        item: optionItem,
        usage: optionStr
    };
};

const _validateArgs = (keys = []) => {
    const commandArg = process.argv[2];
    const $keys = Immutable.fromJS(keys.concat(['help']));
    Fx.fxTerminal(!$keys.contains(commandArg), E.fn10005(commandArg, keys));
};

const executeBody = (commanders = [], Executor = {}) => {
    _validateArgs(commanders.map(commander => commander.command));
    It.itArray(commanders, (commander) => {
        const executor = Executor[commander.executor];
        Fx.fxTerminal(!U.isFunction(executor), E.fn10004(commander.command));
        const option = _buildOption(commander.options);
        const cmd = program.command(commander.command)
            .description(commander.description)
            .usage(`[options] [${option.usage}]`);
        Fx.fxContinue(0 < commander.options.length, () => {
            It.itArray(commander.options, (item, index) => {
                cmd.option(option.item[index].key, option.item[index].desc);
            })
        });
        cmd.action(() => co(executor));
    });
};

const executeEnd = () => {
    program.parse(process.argv);
};
module.exports = {
    executeHeader,
    executeBody,
    executeEnd,
};
