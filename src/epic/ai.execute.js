const program = require('commander');
const U = require('underscore');
const co = require('co');
const Immutable = require('immutable');
const Log = require('./ai.log');
const It = require('./ai.collection');
const Fx = require('./ai.fx');
const E = require('./object.error');
const Input = require('./ai.console');

const executeHeader = (app) => {
    const appInfo = require('../../package.json');
    program.allowUnknownOption();
    program.version(appInfo.version);
    Log.info(`Zero AI 代码生成工具  : `.rainbow + app.yellow);
    Log.info('HomePage   : '.bold + appInfo.homepage.blue);
    Log.info('Github     : '.bold + appInfo.github.blue);
    Log.info(`Version    : ` + `${appInfo.version}`.red + '  ' + `「确认您的Node版本 ( >= 14.x ) 支持ES6, ES7.」`.yellow);
    const ZT = process.env.ZT;
    Fx.fxContinue(!!ZT, () => Log.info(`开启ZT模块开发环境，当前模块：${ZT.red}，特殊命令只能在${`【ZT】`.red}环境使用。`));
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
        const key1 = keys[1] ? keys[1].toString() : undefined;
        if (key1) {
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
        if (!commander.options) commander.options = [];
        const executor = Executor[commander.executor];
        Fx.fxTerminal(!U.isFunction(executor), E.fn10004(commander.command));
        const option = _buildOption(commander.options);
        const cmd = program.command(commander.command)
            .description(commander.description)
            .usage(`[options] [${option.usage}]`);
        Fx.fxContinue(0 < commander.options.length, () => {
            It.itArray(commander.options, (item, index) => {
                const optionItem = option.item[index];
                if (optionItem) {
                    cmd.option(optionItem.key, optionItem.desc);
                }
            })
        });
        cmd.action(() => co(executor));
    });
};

const executeEnd = () => {
    program.parse(process.argv);
};
const executeInput = (required = [], params = []) => {
    const elementArray = required.filter(item => U.isArray(item));
    const isMatrix = 1 < elementArray.length;
    const args = isMatrix ? Input.parseInput(required) : Input.parseInput([required]);
    return Input.parseFormat(args, params)
};
module.exports = {
    executeHeader,
    executeBody,
    executeEnd,
    executeInput,
};
