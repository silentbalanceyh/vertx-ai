const log = require('./ai.log');
const io = require('./ai.io');
const sure = require('./ai.sure');
const fx = require('./ai.fx');
const meta = require('./ai.meta');
const visitor = require('./ai.visitor');
const collection = require('./ai.collection');
const console = require('./ai.console');

const array = require('./ai.array');
const word = require('./ai.word');

const E = require('./ai.error');

const java = require('./ai.java');
const react = require('./ai.react');
const value = require('./ai.value');

const exported = {
    ...log,
    ...io,
    ...sure,
    ...fx,
    ...word,

    ...meta,
    ...visitor,
    ...collection,
    ...console,
    ...array,
    ...value,

    ...java,
    ...react,
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
module.exports = exported;