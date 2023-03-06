const Ec = require("../epic");
const child = require('child_process');
module.exports = () => {
    const actual = Ec.executeInput(
        [
            ['-n', '--name']
        ],
        [
            ['-n', '--name']
        ]
    );
    // 第一步：环境检查
    if (Ec.isExist(".git")) {
        Ec.error("请选择不带`.git`或`vertx-zero-scaffold`的目录执行当前命令，最好使用空目录！");
        return;
    }
    // 第二步：检查 vertx-zero-scaffold
    const target = actual.name;
    Ec.info(`工程构建目录：${target}`);
    const cmd = `git clone https://gitee.com/silentbalanceyh/vertx-zero-scaffold.git ${target}`;
    child.execSync(cmd, {stdio: 'inherit'});
    // 删除目标目录中的 .git 文件夹
    Ec.info(`执行工程初始化：${target}`);
    const cmdGit = `rm -rf ${target}/.git`;
    child.execSync(cmdGit, {stdio: 'inherit'});
   Ec.info(`工程初始化完成：${target}，您可以开始您的Zero Api之行了！`.help);
}
/**
 * ## `aj jinit`
 *
 * ### 1. 命令
 *
 * vertx-zero-scaffold项目脚手架初始化专用命令。
 *
 * ### 2. 执行
 *
 * ```shell
 * # 2.1. 命令语法
 * aj jinit -name <name>
 *
 * # 2.2. 执行测试
 * aj jinit -name test-demo-api
 * [Zero AI] Zero AI 代码生成工具  : <标准工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.2  「确认您的Node版本 ( >= 14.x ) 支持ES6, ES7.」
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
        "name": "test-demo-api"
 * }
 * [Zero AI] 工程构建目录：test-demo-api
 * Cloning into 'test-demo-api'...
 * remote: Enumerating objects: 949, done.
 * remote: Counting objects: 100% (949/949), done.
 * remote: Compressing objects: 100% (176/176), done.
 * remote: Total 949 (delta 719), reused 944 (delta 717), pack-reused 0
 * Receiving objects: 100% (949/949), 1.21 MiB | 1.73 MiB/s, done.
 * Resolving deltas: 100% (719/719), done.
 * [Zero AI] 执行工程初始化：test-demo-api
 * [Zero AI] 工程初始化完成：test-demo-api，您可以开始您的Zero Api之行了！
 * ```
 *
 * ### 3. 选项
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-n|--name|String|（无）|项目名称以及目录名称。|
 *
 * @memberOf module:aj
 * @method jinit
 */