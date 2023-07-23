const Ec = require('../epic');
module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-p', '--path', "."],
            ['-e', '--extension', ".xlsx"],
            ['-w', '--write', "REPLACE"]
        ]
    );
    Ec.cxExist(actual.path);

    Ec.fxError(!["REPLACE", "APPEND"].includes(actual.write), 10036, actual.write);

    const moduleConfig = Ec.javaSmartMod(actual.path);
    // 执行 initialize.json 写入
    const files = Ec.seekChildren(moduleConfig.path,
        (filename) => filename.endsWith(actual.extension));
    const normalized = [];
    files.forEach(file => normalized.push(`${moduleConfig.prefix}${file}`));

    // 读取 initialize.json 文件并执行合并
    const contentJ = Ec.ioJArray(moduleConfig.out);
    const contentT = Ec.jsonCombine(contentJ, normalized, actual.write);
    Ec.outJson(moduleConfig.out, contentT, true);
}
/**
 * ## `aj mod`
 *
 * ### 1. 命令
 *
 * ```shell
 * aj mod -p <path> -e <extension> -w <write>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|无|模块化OOB数据专用目录。|
 * |-e|--extension|String|`.xlsx`|模块化OOB数据专用文件后缀。|
 * |-w|--write|String|`REPLACE`|写入模式，`REPLACE`为替换，`APPEND`为追加。|
 *
 * ### 2. 介绍
 *
 * 此命令为 `zero-battery` 量身打造的命令，用于自动化生成 `initialize.json` 文件专用，此文件为模块化连接文件。
 *
 * ### 3. 执行
 *
 * ```shell
 * aj mod -p src/main/resources/plugin/norm/oob
 * [Zero AI] Zero Ecotope AI工具项  : <专用工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.27  「确认您的Node版本 ( >= 18.x ) 支持ES6, ES7.」
 * [Zero AI] AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *     "path": "src/main/resources/plugin/norm/oob",
 *     "extension": ".xlsx",
 *     "write": "REPLACE"
 * }
 * [Zero AI] Zero AI  检索模块目录构造配置信息。
 * [Zero AI] （Sync）成功将数据写入到文件：/Users/.../ox-norm/src/main/resources/plugin/norm/oob/initialize.json！
 * ```
 *
 * @memberOf module:aj
 * @method mod
 */