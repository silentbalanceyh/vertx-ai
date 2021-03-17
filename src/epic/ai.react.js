const Io = require('./ai.io');
const Fx = require('./ai.fx');
const Log = require('./ai.log');
const Word = require('./ai.word');
const Exec = require('./ai.execute');

const fs = require('fs');
const path = require('path');
const SEPRATOR = path.sep;
const reactRoot = (path) => {
    const current = path ? `${process.cwd()}${SEPRATOR}${path}` : process.cwd();
    let root = Io.dirParent(current, true);
    // 检查哪个目录中包含了package.json来判断根路径
    root = root.filter(item => fs.existsSync(`${item}${SEPRATOR}package.json`));
    Fx.fxError(1 < root.length, 10010, root);
    root = root[0];
    return Io.dirResolve(root);
};
const reactLanguage = () => {
    const root = reactRoot();
    // 生产环境无效
    const env = Io.ioProp(root + SEPRATOR + '.env.development');
    return env['Z_LANGUAGE'] ? env['Z_LANGUAGE'] : 'cn';
};
const reactConfig = (module) => {
    // 路径分析专用
    const slash = Word.strSlashCount(module);
    // 10027：检查ZT环境的格式
    Fx.fxError(1 !== slash, 10027, module);
    if (1 === slash) {
        // 配置
        const configuration = {};
        const language = reactLanguage();
        configuration.module = module;
        configuration.language = language;

        configuration.pathRoot = reactRoot();
        {
            // 资源路径，组件路径
            configuration.pathResource = `src/cab/${language}/${module}`;
            configuration.pathComponent = `src/components/${module}`;
            configuration.pathContainer = `src/container/${module}`;
        }
        return configuration;
    }
}
const reactEnsure = () => {
    const module = process.env.ZT;
    // 10029: 检查ZT环境变量
    Fx.fxError(!module, 10029, module, 'ZT');
    if (module) {
        Log.info(`开启ZT模块开发环境，当前模块：${module.red}，特殊命令只能在${`「ZT」`.red}环境使用。`)
        const moduleConfig = reactConfig(module);
        if (moduleConfig) {
            Log.info(`Zero AI`.cyan + ` 基础环境......`.yellow);
            Log.info(`环境变量：` + `ZT = ${module}`.red);
            Log.info(`模块信息：${moduleConfig.module.blue}`);
            Log.info(`语言信息：${moduleConfig.language.blue}`);
            Log.info(`项目目录：${moduleConfig.pathRoot.blue}`);
            Log.info(`Zero AI`.cyan + ` 结束！！`.yellow);
            return moduleConfig;
        }
    }
}
module.exports = {
    // 环境确认
    reactEnsure,
};