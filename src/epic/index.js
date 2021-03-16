const aiLog = require('./ai.log');
const aiIo = require('./ai.io');
const aiSure = require('./object.sure');
const aiFx = require('./ai.fx');
const aiExecute = require('./ai.execute');
const aiVisitor = require('./ai.visitor');
const aiCollection = require('./ai.it');

const aiArray = require('./ai.array');
const aiWord = require('./ai.word');

const aiJava = require('./ai.java');
const aiReact = require('./ai.react');

const exported = {
    ...aiLog,
    ...aiIo,
    ...aiSure,
    ...aiFx,
    ...aiWord,

    ...aiExecute,
    ...aiVisitor,
    ...aiCollection,
    ...aiArray,

    ...aiJava,
    ...aiReact,
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
 * ### 2. 命令列表
 *
 * |命令执行|含义|
 * |---|:---|
 * |ai csv|读取数据文件中的Array数组数据转换成csv的文件格式并输出。|
 * |ai data|专用数据生成器，可生成`Object/Array`两种数据格式。|
 * |ai key|为输入数据中的Array或Object追加`UUID`格式的字段，字段可配置，默认为`field = key`属性。|
 * |ai uk|检查输入数据中是否包含了`field1,field2,field3`属性中的重复数据，直接输出结果。|
 * |ai uuid|随机生成一定数量的UUID字符串，并且拷贝到剪切板中（MacOs）。|
 *
 * ### 3. 数据通用格式
 *
 * **带data节点**
 *
 * ```json
 * {
 *     "data": [
 *          {
 *              "name": "Lang1",
 *              "email": "lang.yu1@hpe.com"
 *          },
 *          {
 *              "name": "Lang2",
 *              "email": "lang.yu2@hpe.com"
 *          }
 *     ]
 * }
 * ```
 *
 * **直接格式**
 *
 * ```json
 * [
 *      {
 *          "name": "Lang1",
 *          "email": "lang.yu1@hpe.com"
 *      },
 *      {
 *          "name": "Lang2",
 *          "email": "lang.yu2@hpe.com"
 *      }
 * ]
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
module.exports = exported;