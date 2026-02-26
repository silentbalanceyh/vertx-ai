const Ec = require("../epic");
const fs = require("fs");
const path = require("path");
const child = require('child_process');
const Ut = require("../commander-shared");

const REPO_URL = "https://gitee.com/silentbalanceyh/scaffold-ui.git";
const REPO_NAME = "scaffold-ui";

const COMMANDS = [
    "run-default.sh",
    "run-doc.sh",
    "run-zero.sh",
    "run-zero.bat",
    "run-update.sh",
    // 核心配置
    "document/",
    "scripts/",
    "config/",
    // 资源文件：暂时只考虑中文
    "src/cab/cn/cerebration/",
    "src/cab/cn/extension/",
    "src/cab/cn/economy/",
    "src/cab/cn/shared.json",
    // 层代码
    "src/economy/",
    "src/entity@em/",
    "src/extension/",
    "src/environment/",
    // Skin 风格专用代码
    "src/skin/index.d.ts",
    "src/skin/index.entry.js",
    "src/skin/index.js",
    "src/skin/plot.fn.mix.attr.js",
    "src/skin/plot.fn.of.document.js",
    "src/skin/wait._.v.locale.definition.js",
    "src/skin/wait.fn.skin.initialize.js",
    "src/skin/aroma-library/index.js",
    "src/skin/aroma-library/__.theme.shared/",
    // SCSS 风格专用代码
    // "src/style/@old/",
    "src/style/connect/",
    "src/style/macrocosm/index.scss",
    "src/style/macrocosm/mod.screen.scss",
    "src/style/microcosm/",
    "src/style/uca/",
    "src/style/unstable/",
    "src/style/ux@legacy/",
    // Ui
    "src/ui/",
    // Ex
    "src/unfold/",
    "src/upper/",
    "src/utter/",
    // Ux
    "src/ux/",
    "src/zero/",
    "src/zest@web/",
    "src/zion/",
    "src/zither@em/",
    "src/zodiac/",
    "src/zoe@em/",
    "src/zone/",
    "src/index.js"
]

const executeRemote = (actual = {}, options = {}) => {
    const outputBase = "."; // 仓库与 .gitignore 使用项目根目录
    const repoCache = path.resolve(outputBase, ".r2mo", "repo", REPO_NAME);
    const repoCacheDir = path.dirname(repoCache);
    // 确保 .r2mo/repo 目录存在
    if (!fs.existsSync(repoCacheDir)) {
        fs.mkdirSync(repoCacheDir, { recursive: true });
    }
    // 若已有克隆则先删除，再拉取
    if (Ec.isExist(repoCache)) {
        Ec.info(`发现存在旧仓库，正在删除：${repoCache}`);
        child.execSync(`rm -rf ${repoCache}`, options);
    }
    Ec.info(`拉取最新代码到：${repoCache}`);
    child.execSync(`git clone ${REPO_URL} ${repoCache}`, options);
    return repoCache;
}

const executeLocal = (actual = {}, options = {}) => {
    const pathEnv = process.env.Z_AI_SYNC;
    if (!pathEnv) {
        Ec.error("本地模式下，需要设置环境变量：Z_AI_SYNC");
        return false;
    }
    return pathEnv;
}

/**
 * 逆向拷贝：从当前项目将 COMMANDS 所列内容拷贝到 Z_AI_SYNC 指定的骨架项目本地副本
 */
const executeReverse = (targetBase, options = {}) => {
    Ec.info(`逆向拷贝目标（骨架项目本地副本）：${targetBase}`);
    Ec.info(`开始逆向拷贝主框架（与正向 sync 相同内容）：......`.yellow);
    COMMANDS.forEach((command) => {
        Ec.info(`处理：${command.green}`);
        const src = `./${command}`;
        const dest = path.resolve(targetBase, command);
        if (command.endsWith("/")) {
            if (!Ec.isExist(src)) return;
            const destDir = path.resolve(targetBase, command);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            child.execSync(`cp -rf ${src}* "${destDir}"`, options);
        } else {
            if (!Ec.isExist(src)) return;
            const destDir = path.dirname(dest);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            child.execSync(`cp -rf ${src} "${dest}"`, options);
        }
    });
    Ec.info(`逆向拷贝完成：${targetBase}！`.help);
};

module.exports = (options) => {

    // 获取当前操作系统
    const platform = process.platform;

    // 根据操作系统设置不同的 options 对象
    let optionsWait;
    if (platform === 'win32') {
        // Windows 系统，使用指定的命令解释器
        Ec.info(`您正在使用WINDOWS系统，请使用随git附带的bash运行此脚本！`.red.bgYellow);
        optionsWait = {stdio: 'inherit', shell: 'bash.exe'};
    } else {
        // 非 Windows 系统，不需要额外的 options
        optionsWait = {stdio: 'inherit'};
    }

    // -r / --reverse 无值时补 "true"，否则 parseArgument 会报缺值
    const argvRest = process.argv.slice(3);
    const rIdx = argvRest.indexOf("-r");
    const revIdx = argvRest.indexOf("--reverse");
    const flagIdx = rIdx >= 0 ? rIdx : revIdx;
    if (flagIdx >= 0 && (flagIdx + 1 >= argvRest.length || (argvRest[flagIdx + 1] && argvRest[flagIdx + 1].startsWith("-")))) {
        process.argv.splice(3 + flagIdx + 1, 0, "true");
    }
    const parsed = Ut.parseArgument(options);

    // 逆向拷贝：-r 时从当前项目拷贝到 Z_AI_SYNC 指定的骨架项目本地副本
    if (parsed.reverse) {
        const targetBase = process.env.Z_AI_SYNC;
        if (!targetBase || !targetBase.trim()) {
            Ec.error("逆向拷贝需要设置环境变量 Z_AI_SYNC（骨架项目本地副本路径），未设置则退出。");
            process.exit(1);
        }
        const resolved = path.resolve(targetBase.trim());
        executeReverse(resolved, optionsWait);
        return;
    }

    // 1. 环境检查（仅正向同步需要）
    if (!Ec.isExist(".git")) {
        Ec.error("请选择带`.git`或`vertx-ui`的目录执行当前命令！");
        return;
    }

    let pathSource;
    if (parsed.mode) {
        // 本地模式
        pathSource = executeLocal(parsed, optionsWait);
    } else {
        // 远程模式
        pathSource = executeRemote(parsed, optionsWait);
    }
    if (pathSource) {
        const outputBase = ".";
        // 确保 .r2mo/repo 在 .gitignore 中
        const gitignorePath = path.resolve(outputBase, ".gitignore");
        const ignoreEntry = ".r2mo/repo/";
        if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
            const hasIgnoreEntry = gitignoreContent.split("\n").some((line) => {
                const t = line.trim();
                return t === ".r2mo/repo" || t === ".r2mo/repo/";
            });
            if (!hasIgnoreEntry) {
                const newContent = gitignoreContent.endsWith("\n")
                    ? `${gitignoreContent}${ignoreEntry}\n`
                    : `${gitignoreContent}\n${ignoreEntry}\n`;
                fs.writeFileSync(gitignorePath, newContent, "utf-8");
                Ec.info(`已将 ${ignoreEntry} 添加到 .gitignore`);
            }
        } else {
            fs.writeFileSync(gitignorePath, `${ignoreEntry}\n`, "utf-8");
            Ec.info(`已创建 .gitignore 并添加 ${ignoreEntry}`);
        }
        // 拷贝框架文件
        Ec.info(`开始更新主框架：......`.yellow);
        COMMANDS.forEach(command => {
            Ec.info(`处理目录：${command.green}`);
            if (command.endsWith("/")) {
                if (!Ec.isExist(command)) {
                    child.execSync(`mkdir -p ${command}`, optionsWait);
                }
                child.execSync(`cp -rf ${pathSource}/${command}* ./${command}`, optionsWait);
            } else {
                child.execSync(`cp -rf ${pathSource}/${command} ./${command}`, optionsWait);
            }
        });
        Ec.info(`主框架更新完成：${pathSource}！`.help);
        // 拷贝完成后移除临时仓库
        Ec.info(`正在移除临时仓库：${pathSource}`);
        child.execSync(`rm -rf ${pathSource}`, optionsWait);
        Ec.info(`临时仓库已移除。`);
    }
}
/**
 * ## `ai sync`
 *
 * ### 1. 命令
 *
 * ```shell
 * ai sync -p <path>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|.|前端项目根目录，配置文件路径。|
 *
 * ### 2. 介绍
 *
 * 此命令用于从前端直接更新最新的 Zero Ui 框架部分代码，且在前端新版脚手架中，Zero Ui部分的框架代码全部位于 `.gitignore` 文件中不作为源代码提交。
 *
 * ### 3. 执行
 *
 * ```shell
 * ai sync
 * [Zero AI] Zero Ecotope AI工具项  : <标准工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.30  「确认您的Node版本 ( >= 18.x ) 支持ES6, ES7.」
 * [Zero AI] AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *     "path": ".zero"
 * }
 * [Zero AI] 发现存在旧代码，正在删除：.zero/scaffold-ui
 * [Zero AI] 拉取最新代码：.zero/scaffold-ui
 * Cloning into '.zero/scaffold-ui'...
 * remote: Enumerating objects: 4932, done.
 * remote: Counting objects: 100% (4932/4932), done.
 * remote: Compressing objects: 100% (4045/4045), done.
 * remote: Total 4932 (delta 677), reused 4644 (delta 499), pack-reused 0
 * Receiving objects: 100% (4932/4932), 11.34 MiB | 2.12 MiB/s, done.
 * Resolving deltas: 100% (677/677), done.
 * [Zero AI] 开始更新主框架：......
 * [Zero AI] 处理目录：run-default.sh
 * [Zero AI] 处理目录：run-doc.sh
 * [Zero AI] 处理目录：run-zero.sh
 * [Zero AI] 处理目录：run-zero.bat
 * [Zero AI] 处理目录：run-update.sh
 * [Zero AI] 处理目录：document/
 * [Zero AI] 处理目录：scripts/
 * [Zero AI] 处理目录：config/
 * [Zero AI] 处理目录：src/cab/cn/cerebration/
 * [Zero AI] 处理目录：src/cab/cn/extension/
 * [Zero AI] 处理目录：src/cab/cn/economy/
 * [Zero AI] 处理目录：src/cab/cn/shared.json
 * [Zero AI] 处理目录：src/economy/
 * [Zero AI] 处理目录：src/entity@em/
 * [Zero AI] 处理目录：src/extension/
 * [Zero AI] 处理目录：src/environment/
 * [Zero AI] 处理目录：src/skin/index.d.ts
 * [Zero AI] 处理目录：src/skin/index.entry.js
 * [Zero AI] 处理目录：src/skin/index.js
 * [Zero AI] 处理目录：src/skin/plot.fn.mix.attr.js
 * [Zero AI] 处理目录：src/skin/plot.fn.of.document.js
 * [Zero AI] 处理目录：src/skin/wait._.v.locale.definition.js
 * [Zero AI] 处理目录：src/skin/wait.fn.skin.initialize.js
 * [Zero AI] 处理目录：src/skin/aroma-library/index.js
 * [Zero AI] 处理目录：src/skin/aroma-library/__.theme.shared/
 * [Zero AI] 处理目录：src/style/@old/
 * [Zero AI] 处理目录：src/style/connect/
 * [Zero AI] 处理目录：src/style/macrocosm/index.scss
 * [Zero AI] 处理目录：src/style/macrocosm/mod.screen.scss
 * [Zero AI] 处理目录：src/style/microcosm/
 * [Zero AI] 处理目录：src/style/uca/
 * [Zero AI] 处理目录：src/style/unstable/
 * [Zero AI] 处理目录：src/style/ux@legacy/
 * [Zero AI] 处理目录：src/ui/
 * [Zero AI] 处理目录：src/unfold/
 * [Zero AI] 处理目录：src/upper/
 * [Zero AI] 处理目录：src/utter/
 * [Zero AI] 处理目录：src/ux/
 * [Zero AI] 处理目录：src/zero/
 * [Zero AI] 处理目录：src/zest@web/
 * [Zero AI] 处理目录：src/zion/
 * [Zero AI] 处理目录：src/zither@em/
 * [Zero AI] 处理目录：src/zodiac/
 * [Zero AI] 处理目录：src/zoe@em/
 * [Zero AI] 处理目录：src/zone/
 * [Zero AI] 处理目录：src/index.js
 * [Zero AI] 主框架更新完成：.zero/scaffold-ui！
 * ```
 *
 * @memberOf module:ai
 * @method sync
 */