const Io = require('./ai.export.io');
const Fx = require('./ai.export.fx');
const Log = require('./ai.export.log');
const Word = require('./ai.export.word');
const Sr = require('./object.sure');

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
const reactDetect = (module, component) => {
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
            configuration.namespace = `${component}/${module}`;
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
        const moduleConfig = reactDetect(module, category);
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
const reactReady = (config = {}, files = {}) => {
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
    Log.info(`Zero AI `.cyan + ` 2. 文件表：`.rainbow);
    runtime.namespaceFile = runtime.ui + '/Cab.json';

    // 资源文件/脚本文件
    const {
        resource = [],
        ui = [],
    } = files;
    const tpl = config.tpl;
    /*
     * 如果配置了 tpl.target 则是单文件拷贝
     */
    if (tpl.target) {
        /*
         * fileJs模式
         */
        const filename = tpl.target;
        runtime.resourceFiles[filename] = runtime.resource + '/' + filename + ".json";
        runtime.uiFiles[filename] = runtime.ui + '/' + filename + ".js";
    } else {
        /*
         * 非fileJs模式
         */
        resource.filter(each => undefined !== each).forEach(each => {
            const file = runtime.resource + '/' + each + ".json";
            runtime.resourceFiles[each] = file;
            Log.info(`${Word.strWidth(each)} = ${file.blue}`);
        });
        ui.filter(each => undefined !== each).forEach(each => {
            const file = runtime.ui + '/' + each + ".js";
            runtime.uiFiles[each] = file;
            Log.info(`${Word.strWidth(each)} = ${file.yellow}`);
        });
    }
    config.runtime = Fx.fxSorter(runtime);
}
const reactTpl = (name, config = {}) => {
    const {input = {}, tpl = {}} = config;
    // 读取模板
    let tplFile;
    if (tpl.source) {
        const extension = config.extension;
        // 特殊参数注入`#NAME#`
        input.params.NAME = tpl.target;
        tplFile = path.join(__dirname, `../cab/${tpl.type}/${tpl.source}.${extension}.tpl`);
    } else {
        tplFile = path.join(__dirname, `../cab/${tpl.type}/${name}.tpl`);
    }
    if (fs.existsSync(tplFile)) {
        // 读取文件内容
        const content = Io.ioString(tplFile);
        return Word.strExpr(content, input.params);
    } else {
        Log.warn(`Zero AI 对不起，文件不存在`.yellow + `：${tplFile.red}`);
    }
}
// ==========================================================
// 名空间文件 Cab.json
// ==========================================================
const reactTplNamespace = (config) => {
    const runtime = config.runtime;
    Log.info(`Zero AI `.cyan + ` \t3.1. 创建名空间文件......`.rainbow);
    if (!fs.existsSync(runtime.namespaceFile)) {
        const namespace = {};
        namespace.ns = config.namespace;
        Io.outJson(runtime.namespaceFile, namespace, true);
    }
}
// ==========================================================
// 资源文件
// ==========================================================
const reactTplResource = (config) => {
    const runtime = config.runtime;
    Log.info(`Zero AI `.cyan + ` \t3.2. 构造资源文件......`.rainbow);
    const resourceFiles = runtime.resourceFiles;
    Object.keys(resourceFiles).forEach(filename => {
        const fullName = `${filename}.json`;
        const content = reactTpl(fullName, {
            ...config,
            extension: 'json'
        });
        if (content) {
            const contentJson = JSON.parse(content);
            Io.outJson(resourceFiles[filename], contentJson, true);
        }
    });
}
// ==========================================================
// 脚本文件
// ==========================================================
const reactTplUi = (config) => {
    const runtime = config.runtime;
    Log.info(`Zero AI `.cyan + ` \t3.3. 构造界面文件......`.rainbow);
    const uiFiles = runtime.uiFiles;
    Object.keys(uiFiles).forEach(filename => {
        const fullName = `${filename}.js`;
        const content = reactTpl(fullName, {
            ...config,
            extension: 'js'
        });
        if (content) {
            Io.outString(uiFiles[filename], content, true);
        }
    })
}
const reactRun = (config) => {
    Log.info(`Zero AI `.cyan + ` 3. 执行React命令......`.rainbow);
    // 1. 创建名空间文件
    reactTplNamespace(config);
    // 2. 资源文件
    reactTplResource(config);
    // 3. 构造代码文件
    reactTplUi(config);
    Log.info(`Zero AI `.cyan + ` 4. 命令执行完成！！！`.rainbow);
}
const reactConfig = (config = {}) => {
    const {
        filename,
        tpl,
        resource = [],
        ui = []
    } = config;
    const configuration = reactEnsure();
    if (configuration) {
        Sr.cxExist(filename);
        const inputConfig = Io.ioJObject(filename);
        configuration.tpl = tpl;
        configuration.input = inputConfig;
        // 构造和准备
        reactReady(configuration, {
            resource,
            ui
        });
        return configuration;
    }
}
module.exports = {
    reactConfig,
    reactRun,
};