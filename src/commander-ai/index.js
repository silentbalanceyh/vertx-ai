const executeUuid = require('./fn.uuid');
const executeCsv = require('./fn.csv');
const executeUk = require('./fn.uk');
const executeKey = require('./fn.key');
const executeData = require('./fn.data');
const executeInit = require('./fn.init');
const executeString = require('./fn.random');
const executeMD5 = require('./fn.md5');
const executeSync = require('./fn.sync');
const exported = {
    executeUuid,        // ai uuid
    executeCsv,         // ai csv
    executeUk,          // ai uk
    executeKey,         // ai key
    executeData,        // ai data
    executeInit,        // ai init
    executeString,      // ai str
    executeMD5,         // ai md5
    executeSync,        // ai sync
};
module.exports = exported;
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
 * > 若命令带了 `(M)`，则表示 MacOS 系统中，会将生成结果直接拷贝到剪切板中随后可直接粘贴。
 *
 * |命令执行|含义|
 * |---|:---|
 * |ai uuid|(M) 随机生成一定数量的UUID字符串|
 * |ai csv|读取数据文件中的Array数组数据，然后转换成csv的文件格式输出。|
 * |ai uk|检查数据文件中的 Data 数据是否符合唯一性约束，可直接针对批量数据执行唯一性检查。|
 * |ai data|专用数据生成器，可根据您的输入生成两个格式的Json数据：`Object/Array`。|
 * |ai key|为输入数据中的Array或Object追加`UUID`格式的字段，字段可配置，默认为`field = key`属性。|
 * |ai str|(M) 生成随机字符串。
 * |ai md5|(M) 针对输入字符串进行符合 Zero 规范的 MD5 加密处理。|
 * |ai init|「工程命令」Zero前端工程初始化专用命令。|
 * |ai sync|「工程命令」Zero前端工程框架同步专用命令（更新Zero Ui框架专用）。|
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