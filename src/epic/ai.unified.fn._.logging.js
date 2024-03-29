const colors = require("colors");
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});
/**
 * ## `Ec.error`
 *
 * 工具专用日志，`ERROR`级别，（黄色），消息前缀包含`[Zero AI]`前缀。
 *
 * @memberOf module:_debug
 * @param {String} message 打印的日志信息。
 */
const error = (message) => console.error(`[Zero AI Error] `.red.bold + `${message}`.red);
/**
 * ## `Ec.info`
 *
 * 工具专用日志，`INFO`级别，（普通日志），消息前缀包含`[Zero AI]`前缀。
 *
 * @memberOf module:_debug
 * @param {String} message 打印的日志信息。
 */
const info = (message) => console.info(`[Zero AI]`.green.bold + ` ${message}`);
/**
 * ## `Ec.warn`
 *
 * 工具专用日志，`INFO`级别，（警告日志），消息前缀包含`[Zero AI]`前缀。
 *
 * @memberOf module:_debug
 * @param {String} message 打印的日志信息。
 */
const warn = (message) => console.warn(`[Zero AI]`.yellow.bold + ` ${message}`.yellow);
module.exports = {
    info,
    warn,
    error,
};