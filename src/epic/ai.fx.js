const U = require('underscore');
const Log = require('./ai.log');
const E = require('./object.error');
const fxCond = (arg) => {
    if (U.isFunction(arg)) {
        arg = arg();
    }
    return arg;
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
/**
 * ## `Ec.fxContinue`
 *
 * ### 1. 基本介绍
 *
 * 专用二分函数，条件满足时执行`executor`函数，示例代码如：
 *
 * ```js
 * Fx.fxContinue(0 < items.length, () => {
 *      const prefixes = inflect.pluralize(prefix);
 *      result[prefixes] = items;
 * });
 * ```
 *
 * @memberOf module:_debug
 * @param {Boolean/Function} condition 条件或条件函数。
 * @param {Function} executor 满足条件时的执行函数。
 * @returns {Any} 如果有executor则返回该函数的执行返回值。
 */
const fxContinue = (condition, executor) => {
    if (fxCond(condition) && U.isFunction(executor)) {
        return executor();
    }
};
/**
 * ## `Ec.fxSorter`
 *
 * 「调试专用」对输入对象按属性执行字典序的排列，生成新的对象，方便打印和查看对象基本信息。
 *
 * @memberOf module:_debug
 * @param {Object} input 输入排序之前的对象
 * @returns {Object} 返回排序后的对象
 */
const fxSorter = (input = {}) => {
    const normalized = {};
    const keys = Object.keys(input).sort((left, right) => sortString(left, right, true));
    keys.forEach(key => normalized[key] = input[key]);
    return normalized;
};
/**
 * ## `Ec.fxError`
 *
 * ### 1. 基本介绍
 *
 * 参考下边调用代码
 *
 * ```js
 * // 第一种调用方法：第一参直接是错误代码
 * Ec.fxError(10001, arg1, arg2);
 *
 * // 第二种调用方法：第一参是Boolean值，true就输出，第二参是错误代码
 * const checked = true;
 * Ec.fxError(checked, 10001, arg1, arg2);
 *
 * // 第三种调用方法：第一参是Function，执行后结果为true就输出，第二参是错误代码
 * const fnChecked = () => true;
 * Ec.fxError(fnChecked, 10001, arg1, arg2);
 * ```
 *
 * ### 2. 注意点
 *
 * * 第一个参数有三种形态，带条件的有两种形态：Boolean/Function，不带条件时直接表示错误代码。
 * * 第二个参数会受到第一个参数的影响，要么错误代码，要么剩余参数的首参。
 *
 * @memberOf module:_debug
 * @param {Boolean/Function/Number} cond 条件，条件函数和错误代码。
 * @param {*} code 错误代码或首参。
 * @param {*} args 返回剩余参数信息。
 */
const fxError = (cond, code, ...args) => {
    /*
     * 先提取输入参数
     * 1. cond 为 Number
     * 2. cond 为 Boolean, code 为 Number
     */
    let checked = false;
    let fnMessage;
    const inputArgs = [];
    if (U.isFunction(cond)) {
        checked = cond();
        const fnError = `fn${code}`;
        fnMessage = E[fnError];

    } else if (U.isBoolean(cond)) {
        checked = cond;
        const fnError = `fn${code}`;
        fnMessage = E[fnError];
    } else if (U.isNumber(cond)) {
        checked = true;
        const fnError = `fn${cond}`;
        fnMessage = E[fnError];
        inputArgs.push(code);
    }
    if (U.isFunction(fnMessage)) {
        if (checked) {
            args.forEach(arg => inputArgs.push(arg));
            const errorMessage = fnMessage.apply(this, inputArgs);
            Log.error(errorMessage);
        }
    } else {
        throw new Error(`找不到错误代码描述：${code}`);
    }
}
module.exports = {
    fxError,
    fxSorter,
    fxContinue
};
