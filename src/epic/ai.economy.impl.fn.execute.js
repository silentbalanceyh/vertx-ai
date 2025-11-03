const program = require('commander');
const U = require('underscore');
const co = require('co');
const Immutable = require('immutable');
const __LOG = require('./ai.unified.fn._.logging');
const __IT = require('./ai.uncork.fn.it.feature');
const __FX = require('./ai.under.fn.fx.terminal');
const __PR = require('./ai.export.impl.fn.parse');


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
        __FX.fxError(isError, 10005, commandArg, keys);
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
 * @memberOf module:_epic
 * @param {String} app 应用程序名
 */
const executeHeader = (app) => {
    const appInfo = require('../../package.json');
    program.allowUnknownOption();
    program.version(appInfo.version);
    __LOG.info(`----------------- Rachel Momo / AI工具项  ------------------`.rainbow);
    __LOG.info('应用名称: '.bold + app);
    __LOG.info('工具主页: '.bold + appInfo.homepage.blue);
    __LOG.info(`工具版本: ` + `${appInfo.version}`.red + '  ' + `( Node >= 22.x )`.yellow);
    __LOG.info();
    __LOG.info("----------------- AI 系统启动…… ----------------------------".rainbow);
    if (3 > process.argv.length) {
        __LOG.error("命令缺失，请输入正确的命令！");
    }
};
/**
 * ## `Ec.executeBody`
 *
 * 执行命令的主方法
 *
 * @memberOf module:_epic
 * @param {Array} commanders 指令集
 * @param {Object} Executor 指令执行集`field = Function`格式
 */
const executeBody = (commanders = [], Executor = {}) => {
    if (_validateArgs(commanders.map(commander => commander.command))) {
        __IT.itArray(commanders, (commander) => {
            if (!commander.options) commander.options = [];
            const executor = Executor[commander.executor];
            __FX.fxError(!U.isFunction(executor), 10004, commander.command);
            const option = _buildOption(commander.options);
            const cmd = program.command(commander.command)
                .description(commander.description)
                .usage(`[options] [${option.usage}]`);
            __FX.fxContinue(0 < commander.options.length, () => {
                // 设置选项
                commander.options.forEach(option => {
                    cmd.option(`-${option.alias}`, option.description);
                    cmd.option(`--${option.name}`, option.description);
                })
            });
            cmd.action(() => co(() => executor(commander.options)));
        });
    }
};
/**
 * ## `Ec.executeEnd`
 *
 * @memberOf module:_epic
 * 执行命令时打印尾信息
 */
const executeEnd = () => {
    program.parse(process.argv);
};
module.exports = {
    executeHeader,
    executeBody,
    executeEnd,
};
