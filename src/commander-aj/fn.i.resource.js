const Ec = require("../epic");
const path = require("path");

module.exports = () => {
    const actual = Ec.executeInput(
        [
            ["-c", "--config"],
            ["-o", "--out"]
        ],
        [
            ["-c", "--config"],
            ["-o", "--out"]
        ]
    );
    if (Ec.isExist(actual.config)) {
        const config = Ec.ioJObject(actual.config);
        const file = {};
        file.resource = path.join(__dirname, `../cab/resource/resource.xlsx`);
        file.json = path.join(__dirname, `../cab/resource/resource.json`);
        file.auth = path.join(__dirname, `../cab/resource/falcon.resource.xlsx`);
        file.identifier = config.identifier
        const parameters = {};
        parameters.NAME = config.name;
        parameters.MODULE = config.module;
        parameters.ID = config.identifier;
        parameters.API = config.api;
        parameters.SET = config.set;
        parameters.TYPE = config.type;
        Ec.excelRes(file, parameters);
    } else {
        throw new Error(`对不起，配置文件"${actual.config}"不存在！！`)
    }
}
/**
 * ## `aj rs`
 *
 * ### 1. 命令

 * ```shell
 * aj rs -c <config> -o <output>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-c|--config|String|无|配置文件路径。|
 * |-o|--output|String|无|输出目录路径。|
 *
 * ### 2. 介绍
 *
 * 此命令为 `zero-crud` 模块量身打造的命令，最新BUG修复之后，您可以直接使用此命令生成专用 Excel/Json 配置文件，并将此文件数据导入到系统中，即可直接连接 `zero-rbac` 实现接口的权限授权处理。
 *
 * ### 3. 执行
 *
 * ```shell
 * aj rs -c nm-law.json -o .
 * [Zero AI] Zero Ecotope AI工具项  : <专用工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.27  「确认您的Node版本 ( >= 18.x ) 支持ES6, ES7.」
 * [Zero AI] AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *     "config": "nm-law.json",
 *     "out": "."
 * }
 * [Zero AI] Zero AI  1. 准备生成资源信息..., {"NAME":"法规","MODULE":"doc.law","ID":"nm.law","API":"nm-law","TYPE":"resource.document"}
 * [Zero AI] Zero AI  2. 生成 Zero Extension 资源文件...
 * [Zero AI] Zero AI  2.1. 数据加载中，替换原始文件……
 * [Zero AI] Zero AI  2.2. 分析结果：最大行 - 64，最大列 - 16384。
 * [Zero AI] Zero AI  2.3. 正在解析表达式......
 * [Zero AI] Zero AI  2.4. 创建新数据文件......
 * [Zero AI] Zero AI  执行Worksheet：./nm.law.xlsx。
 * [Zero AI] Zero AI  3. 资源生成完成...
 * [Zero AI] Zero AI  4. 准备生成权限信息..., {"NAME":"法规","MODULE":"doc.law","ID":"nm.law","API":"nm-law","TYPE":"resource.document"}
 * [Zero AI] Zero AI  2.1. 数据加载中，替换原始文件……
 * [Zero AI] Zero AI  2.2. 分析结果：最大行 - 20，最大列 - 16384。
 * [Zero AI] Zero AI  2.3. 正在解析表达式......
 * [Zero AI] Zero AI  2.4. 创建新数据文件......
 * [Zero AI] Zero AI  执行Worksheet：./falcon.nm.law.xlsx。
 * [Zero AI] Zero AI  5. 权限文件生成完成...
 * [Zero AI] Zero AI  执行完成...
 * [Zero AI] （Async）成功将数据写入到文件：./nm.law.json！
 * ```
 *
 * ### 4. 配置文件
 *
 * 此处特殊说明一下输入配置文件的基本格式和内容：
 *
 * ```json
 * {
 *     "name": "界面显示的业务模块名称",
 *     "module": "生成资源码、权限码、行为码专用和当前模型绑定的模块名称",
 *     "identifier": "模型的统一标识符，静态和动态都可支持",
 *     "api": "crud接口中的 :actor 参数",
 *     "type": "对应到 S_RESOURCE 中的 TYPE 字段实现资源定义和资源管理专用"
 * }
 * ```
 *
 * @memberOf module:aj
 * @method rs
 */