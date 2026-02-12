const executeUuid = require('./fn.random.uuid');
const executeString = require('./fn.random.string');
const executeMD5 = require('./fn.random.md5');
const executeFrontendSync = require('./fn.source.sync');
const executeHelp = require('./fn.help.metadata');
const executeWeb = require('./fn.source.front');

const executeSpring = require('./fn.source.spring');
const executeZero = require('./fn.source.zero');
const executeApply = require('./fn.source.apply');
const executeExPerm = require('./fn.ex.perm');
const exported = {
    executeUuid,                // ai uuid
    executeString,              // ai str
    executeMD5,                 // ai md5
    executeFrontendSync,        // ai sync
    executeHelp,                // ai help
    executeWeb,                 // ai web
    // Spring 脚手架
    executeSpring,              // ai spring
    // Zero 基础脚手架
    executeZero,                // ai zero
    // Cursor 规则安装
    executeApply,               // ai apply
    executeExPerm,              // ai ex-perm
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
 * |ai str|(M) 生成随机字符串。
 * |ai md5|(M) 针对输入字符串进行符合 Zero 规范的 MD5 加密处理。|
 * |ai sync|「工程命令」Zero前端工程框架同步专用命令（更新Zero Ui框架专用）。|
 * |ai app| 应用工程初始化。|
 * |ai mod| 扩展模块初始化（Domain/Provider/Api）。|
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