const Ec = require("../epic");
const child = require('child_process');

module.exports = () => {

    // 获取当前操作系统
    const platform = process.platform;

    // 根据操作系统设置不同的 options 对象
    let options;
    if (platform === 'win32') {
        // Windows 系统，使用指定的命令解释器
        Ec.info(`您正在使用WINDOWS系统，请使用随git附带的bash运行此脚本！`.red.bgYellow);
        options = { stdio: 'inherit', shell: 'bash.exe' };
    } else {
        // 非 Windows 系统，不需要额外的 options
        options = { stdio: 'inherit' };
    }

    const actual = Ec.executeInput(
        [],
        [
            ['-p', '--path', '.zero']
        ]
    );
    // 1. 环境检查
    if (!Ec.isExist(".git")) {
        Ec.error("请选择带`.git`或`vertx-ui`的目录执行当前命令！");
        return;
    }
    const path = actual.path;
    // 2. 创建 .zero 目录
    const cmdDir = `mkdir -p ${path}`;
    child.execSync(cmdDir, options);
    const pathSource = `${path}/scaffold-ui`
    // 3. 删除 .zero/vertx-ui 目录
    if (Ec.isExist(pathSource)) {
        Ec.info(`发现存在旧代码，正在删除：${pathSource}`);
        const cmdDel = `rm -rf ${pathSource}`;
        child.execSync(cmdDel, options);
    }
    // 4. 重新拉取代码
    Ec.info(`拉取最新代码：${pathSource}`);
    const cmdGit = `git clone https://gitee.com/silentbalanceyh/scaffold-ui.git ${pathSource}`;
    child.execSync(cmdGit, options);
    const cmdRm = `rm -rf ${pathSource}/.git`;
    child.execSync(cmdRm, options);

    // 5. 拷贝 Ignore 文件全部指令
    const commands = [
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
        "src/style/@old/",
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

    Ec.info(`开始更新主框架：......`.yellow);
    commands.forEach(command => {
        Ec.info(`处理目录：${command.green}`);
        let cmd;
        if (command.endsWith("/")) {
            // 目录拷贝
            if (!Ec.isExist(command)) {
                const cmdDir = `mkdir -p ${command}`;
                child.execSync(cmdDir, options);
            }
            cmd = `cp -rf ${pathSource}/${command}* ./${command}`;
            child.execSync(cmd, options);
        } else {
            // 文件拷贝
            cmd = `cp -rf ${pathSource}/${command} ./${command}`;
            child.execSync(cmd, options);
        }
    })
    Ec.info(`主框架更新完成：${pathSource}！`.help);
}