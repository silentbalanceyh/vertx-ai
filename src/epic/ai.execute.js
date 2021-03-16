const program = require('commander');
const U = require('underscore');
const co = require('co');
const Immutable = require('immutable');
const Log = require('./ai.log');
const It = require('./ai.it');
const Fx = require('./ai.fx');
const Vt = require('./ai.visitor');


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
    const skip = Immutable.fromJS(["-h", '-V', '--version', '--help']);
    if (!skip.contains(commandArg)) {
        const $keys = Immutable.fromJS(keys.concat(['help']));
        const isError = !$keys.contains(commandArg);
        // 检测未通过时，打印错误信息
        Fx.fxError(isError, 10005, commandArg, keys);
        return !isError;
    } else {
        // 直接跳过，检测未通过
        return false;
    }
};
/**
 * ## `Ec.executeHeader`
 *
 * 执行命令时打印头信息
 *
 * @memberOf module:epic
 * @param {String} app 应用程序名
 */
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
/**
 * ## `Ec.executeBody`
 *
 * 执行命令的主方法
 *
 * @memberOf module:epic
 * @param {Array} commanders 指令集
 * @param {Object} Executor 指令执行集`field = Function`格式
 */
const executeBody = (commanders = [], Executor = {}) => {
    if (_validateArgs(commanders.map(commander => commander.command))) {
        It.itArray(commanders, (commander) => {
            if (!commander.options) commander.options = [];
            const executor = Executor[commander.executor];
            Fx.fxError(!U.isFunction(executor), 10004, commander.command);
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
    }
};
/**
 * ## `Ec.executeEnd`
 *
 * @memberOf module:epic
 * 执行命令时打印尾信息
 */
const executeEnd = () => {
    program.parse(process.argv);
};
/**
 * ## `Ec.executeInput`
 *
 * ### 1. 基本介绍
 *
 * ```js
 *     const actual = Ec.executeInput(
 *          [],
 *          [
 *              ['-n', '--number', 20]
 *          ]
 *     );
 * ```
 *
 * ### 2. 参数列表
 *
 * #### 2.1. required 参数格式：
 *
 * ```js
 * // 索引1：短参数
 * // 索引2：长参数
 * ["-h", "--help"]
 * ```
 *
 * #### 2.2. optional 参数格式：
 *
 * ```js
 * // 索引1：短参数
 * // 索引2：长参数
 * // 索引3：参数的默认值
 * ['-n', '--number', 20]
 * ```
 *
 * @memberOf module:epic
 * @param {Array} required 必须参数设置
 * @param {Array} optional 可选参数设置
 * @returns {Object} 生成最终的参数集
 */
const executeInput = (required = [], optional = []) => {
    const elementArray = required.filter(item => U.isArray(item));
    const isMatrix = 1 < elementArray.length;
    const args = isMatrix ? Vt.parseInput(required) : Vt.parseInput([required]);
    return Vt.parseFormat(args, optional)
};
module.exports = {
    executeHeader,
    executeBody,
    executeEnd,
    executeInput,
};
