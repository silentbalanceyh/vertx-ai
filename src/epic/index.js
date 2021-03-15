const aiLog = require('./ai.log');
const aiIo = require('./ai.io');
const aiSure = require('./ai.sure');
const aiFx = require('./ai.fx');
const aiMeta = require('./ai.meta');
const aiVisitor = require('./ai.visitor');
const aiCollection = require('./ai.collection');
const aiConsole = require('./ai.console');

const aiArray = require('./ai.array');
const aiWord = require('./ai.word');


const aiJava = require('./ai.java');
const aiReact = require('./ai.react');
const aiValue = require('./ai.value');

const E = require('./ai.error');

const exported = {
    ...aiLog,
    ...aiIo,
    ...aiSure,
    ...aiFx,
    ...aiWord,

    ...aiMeta,
    ...aiVisitor,
    ...aiCollection,
    ...aiConsole,
    ...aiArray,
    ...aiValue,

    ...aiJava,
    ...aiReact,
    E,
};
/**
 * @overview
 *
 * # Zero Ai研发文档
 *
 * 该文档提供给研发人员直接研发下列工具专用：
 *
 * ## 1. 命令清单
 *
 * * `ai xxx`：基础命令工具。
 * * `aj xxx`：界面工具集。
 *
 * ## 2. Epic使用方法
 *
 * ```js
 * const Ec = require('./epic');
 * // Ec.xxx 调用全程Api
 * ```
 *
 *
 */
/**
 * ## ai命令
 *
 * ### 1. 基本使用
 *
 * ai命令的专用语法如下：
 *
 * ```shell
 * ai <command> [options1|options2|options3...]
 * ```
 *
 * @module ai
 */
/**
 * ## aj命令
 *
 * aj命令的专用语法如下：
 *
 * ```shell
 * aj <command> [options1|options2|options3...]
 * ```
 *
 * @module aj
 */
/**
 * ## epic核心库
 *
 * @module epic
 */

/**
 * ## debug调试库
 *
 * @module debug
 */
console.log(aiFx.fxSorter(exported));
module.exports = exported;