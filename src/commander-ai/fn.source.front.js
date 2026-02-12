const Ec = require("../epic");
const Ut = require("../commander-shared");
const child = require('child_process');
module.exports = (options) => {
    const parsed = Ut.parseArgument(options);
    // 第一步：环境检查
    if (Ec.isExist(".git")) {
        Ec.error("请选择不带`.git`或`vertx-ui`的目录执行当前命令，最好使用空目录！");
        return;
    }
    // 第二步：检查 vertx-ui
    const target = parsed.name;
    if (!target || !String(target).trim()) {
        Ec.error("缺少必需参数：前端项目名称");
        Ec.info("参数格式：");
        Ec.info("  -n <名称>    或  --name <名称>");
        Ec.info("示例：");
        Ec.info("  ai web -n my-web");
        Ec.info("  ai web --name my-web");
        process.exit(1);
    }
    Ec.info(`工程构建目录：${target}`);
    const cmd = `git clone https://gitee.com/silentbalanceyh/scaffold-ui.git ${target}`;
    child.execSync(cmd, {stdio: 'inherit'});
    // 删除目标目录中的 .git 文件夹
    Ec.info(`执行工程初始化：${target}`);
    const cmdGit = `rm -rf ${target}/.git`;
    child.execSync(cmdGit, {stdio: 'inherit'});
    // 读取目标目录
    const content = Ec.ioJObject(`${target}/package.json`);
    content.name = target;
    Ec.outJson(`${target}/package.json`, content, true);
    // 后期脚本
    const commands = [
        `rm -rf ${target}/.zero/*`,
        `rm -rf ${target}/document/doc-web`,
        `rm -rf ${target}/guide/`,
        `rm -rf ${target}/_config.yml`,
        `rm -rf ${target}/CNAME`,
        `rm -rf ${target}/data.json`,
        `rm -rf ${target}/LICENSE`,
        `rm -rf ${target}/package-lock.json`,
        `rm -rf ${target}/yarn.lock`,
        `rm -rf ${target}/run-cache.sh`,
        `rm -rf ${target}/run-ux.sh`,
        `rm -rf ${target}/run-zero-dependency.sh`,
        `rm -rf ${target}/SUMMARY.md`,
    ]
    Ec.info(`执行后期处理：......`.yellow);
    commands.forEach(command => {
        Ec.info(`资源清理中：${command.prompt}`);
        child.execSync(command, {stdio: 'inherit'})
    });
    // 重铸 .gitignore 文件
    Ec.info(`重铸 .gitignore`);
    child.execSync(`mv ${target}/.gitignore.tpl ${target}/.gitignore`, {stdio: 'inherit'})
    Ec.info(`工程初始化完成：${target}，您可以开始您的Zero Ui之行了！`.help);
}
/**
 * ## `ai init`
 *
 * ### 1. 命令
 *
 * ```shell
 * ai init -name <name>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-n|--name|String|（无）|项目名称以及目录名称。|
 *
 * ### 2. 介绍
 *
 * vertx-ui项目脚手架初始化专用命令。
 *
 * ### 3. 执行
 *
 * ```shell
 * ai init -name test-demo
 * [Zero AI] Zero AI 代码生成工具  : <标准工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.2  「确认您的Node版本 ( >= 14.x ) 支持ES6, ES7.」
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 "name": "test-demo"
 * }
 * [Zero AI] 工程构建目录：test-demo
 * Cloning into 'test-demo'...
 * remote: Enumerating objects: 888, done.
 * remote: Counting objects: 100% (888/888), done.
 * remote: Compressing objects: 100% (538/538), done.
 * remote: Total 36593 (delta 445), reused 610 (delta 339), pack-reused 35705
 * Receiving objects: 100% (36593/36593), 29.09 MiB | 151.00 KiB/s, done.
 * Resolving deltas: 100% (24009/24009), done.
 * [Zero AI] 执行工程初始化：test-demo
 * [Zero AI] （Sync）成功将数据写入到文件：test-demo/package.json！
 * [Zero AI] 执行后期处理：......
 * [Zero AI] 资源清理中：rm -rf test-demo/.zero/*
 * [Zero AI] 资源清理中：rm -rf test-demo/document/doc-web/*
 * [Zero AI] 资源清理中：rm -rf test-demo/document/doc-web-extension/*
 * [Zero AI] 资源清理中：rm -rf test-demo/guide/
 * [Zero AI] 资源清理中：rm -rf test-demo/_config.yml
 * [Zero AI] 资源清理中：rm -rf test-demo/CNAME
 * [Zero AI] 资源清理中：rm -rf test-demo/data.json
 * [Zero AI] 资源清理中：rm -rf test-demo/LICENSE
 * [Zero AI] 资源清理中：rm -rf test-demo/package-lock.json
 * [Zero AI] 资源清理中：rm -rf test-demo/yarn.lock
 * [Zero AI] 工程初始化完成：test-demo，您可以开始您的Zero Ui之行了！
 * ```
 *
 * @memberOf module:ai
 * @method init
 */