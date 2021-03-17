const Io = require('./ai.io');
const Fx = require('./ai.fx');
const Log = require('./ai.log');
const Word = require('./ai.word');

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
const reactConfig = (module, component) => {
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
            configuration.pathResource = `src/cab/${language}/${component}/${module}`;
            configuration.pathUi = `src/${component}/${module}`;
        }
        return configuration;
    }
}
const reactEnsure = (category = 'components') => {
    const module = process.env.ZT;
    // 10029: 检查ZT环境变量
    Fx.fxError(!module, 10029, module, 'ZT');
    if (module) {
        Log.info(`「启用ZT环境」，当前模块：${module.red}，特殊命令只能在${`ZT`.red}环境使用。`)
        const moduleConfig = reactConfig(module, category);
        if (moduleConfig) {
            Log.info(`Zero AI `.cyan + ` 0. 基础环境......`.rainbow);
            Log.info(`环境变量：` + `ZT = ${module}`.red);
            Log.info(`模块信息：${moduleConfig.module.blue}`);
            Log.info(`语言信息：${moduleConfig.language.blue}`);
            Log.info(`项目目录：${moduleConfig.pathRoot.blue}`);
            return moduleConfig;
        }
    }
}
/*
 * 目录创建专用
 */
const reactRuntime = (config = {}, files = {}) => {
    Log.info(`Zero AI `.cyan + ` 1. 目录检查......`.rainbow);
    // 资源目录
    const runtime = {};
    runtime.resource = config.pathRoot + '/' + config.pathResource;
    runtime.resourceFiles = {};
    Io.dirCreate(runtime.resource);
    // 组件目录
    runtime.ui = config.pathRoot + '/' + config.pathUi;
    runtime.uiFiles = {};
    Io.dirCreate(runtime.ui);

    // 其他目录专用计算
    runtime.namespace = runtime.ui + '/Cab.json';
    const {
        resource = [],
        ui = []
    } = files;
    resource.forEach(each => runtime.resourceFiles[each] = runtime.resource + '/' + each + ".json");
    ui.forEach(each => runtime.uiFiles[each] = runtime.ui + '/' + each + ".js");
    config.runtime = Fx.fxSorter(runtime);
}
module.exports = {
    // 环境确认
    reactEnsure,
    // 1. 目录创建
    reactRuntime
};