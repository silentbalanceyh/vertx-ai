const Ec = require('../epic');
const fs = require("fs");
const path = require("path");
module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-p', '--path', "."]
        ]
    );
    const inputPath = actual.path;
    Ec.info(`Bundle规范目录创建：${inputPath}`);
    [
        "lib/extension",
        "modeler/emf",
        "modeler/atom",
        "modeler/atom/meta",
        "modeler/atom/reference",
        "modeler/atom/rule",
        "init/modeler",
        "init/store/ddl",
        "init/cloud",
        "init/development",
        "init/oob/resource",
        "backend/scripts/groovy",
        "backend/scripts/js",
        "backend/scripts/jruby",
        "backend/scripts/jpython",
        "backend/endpoint/api",
        "backend/endpoint/web-socket",
        "backend/endpoint/service-bus",
        "backend/webapp/WEB-INF",
        "backend/components",
        "backend/components/task",
        "backend/components/handler",
        "backend/components/event",
        "backend/components/validator",
        "frontend/assembly",
        "frontend/cab/cn",
        "frontend/cab/en",
        "frontend/cab/jp",
        "frontend/scripts/js",
        "frontend/scripts/ts",
        "frontend/skin/",
        "frontend/images/",
        "frontend/images/icon",
        "frontend/components",
    ].forEach(filename => fs.mkdirSync(inputPath + "/" + filename, {recursive: true}));
    Ec.info(`即将拷贝说明文件：`);
    Ec.ioCopy(path.join(__dirname, "./bundle/specification.txt"), inputPath + "/specification.txt");
}
/**
 * ## `aj bundle`
 *
 * ### 1. 命令
 *
 * ```shell
 * aj bundle -p <path>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|无|生成目录规范的主目录。|
 *
 * ### 2. 介绍
 *
 * 使用该命令生成一个 OSGI Bundle 专用的目录结构
 *
 * ### 3. 执行
 *
 * ```shell
 * ai bundle -p <path>
 *
 * [Zero AI] Zero Ecotope AI工具项  : <专用工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.25  「确认您的Node版本 ( >= 18.x ) 支持ES6, ES7.」
 * [Zero AI] AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *     "path": "."
 * }
 * [Zero AI] Bundle规范目录创建：.
 * [Zero AI] 即将拷贝说明文件：
 * [Zero AI] （Async）成功将数据写入到文件：./specification.txt！
 * ```
 *
 * @memberOf module:aj
 * @method bundle
 **/
