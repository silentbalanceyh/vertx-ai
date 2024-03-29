const __IO = require('./ai.export.interface.io');
const __FX = require('./ai.under.fn.fx.terminal');
const __LOG = require('./ai.unified.fn._.logging');
const __STR = require('./ai.export.interface.fn.string');
const __SK = require('./ai.export.impl.fn.seek');
const U = require('underscore');
const {config} = require("exceljs");

const ensureMaven = (path, module) => {
    if (!__IO.isFile(path)) {
        __FX.fxError(10017, module);
    }
}
const ensureZero = (path, module) => {
    if (!__IO.isDirectory(path)) {
        __FX.fxError(10033, module);
    }
}
const ensureOx = (path, module) => {
    if (!__IO.isDirectory(path)) {
        __FX.fxError(10034, module);
    }
}
const detectMaven = (modulePath) => {
    const configuration = {};
    // pom.xml 文件检查
    const pom = modulePath + `/pom.xml`;
    ensureMaven(pom, modulePath);
    configuration.pathPom = pom;
    // 「Zero」src/main/java 检查
    const source = modulePath + '/src/main/java';
    ensureZero(source, modulePath);
    configuration.pathSource = source;
    // 「Zero」src/main/resources 检查
    const resource = modulePath + '/src/main/resources';
    ensureZero(resource, modulePath);
    configuration.pathResource = resource;
    return configuration;
}
const detectOx = (modulePath, configuration = {}) => {
    const resource = configuration.pathResource;
    // 「Ox」src/main/resources/cab
    const cab = resource + '/cab';
    ensureOx(cab, modulePath);
    configuration.pathOxCab = cab;
    // 「Ox」src/main/resources/init/oob
    const oob = resource + '/init/oob';
    ensureOx(oob, modulePath);
    configuration.pathOxOOB = oob;
    // 「Ox」src/main/resources/runtime
    const runtime = resource + '/runtime';
    ensureOx(runtime, modulePath);
    configuration.pathOxRuntime = runtime;
    return configuration;
}
const detectPlugin = (modulePath, configuration = {}) => {
    const module = configuration.module;
    const source = configuration.pathSource;
    const resource = configuration.pathResource;
    const packagePath = `/cn/originx/${module}/`;
    configuration.modulePackage = `cn.originx.${module}`;
    configuration.moduleAlias = __STR.strFirstUpper(module).substring(0, 2);
    configuration.moduleLog = module.toUpperCase();
    // 源代码
    configuration.sourceComponent = source + packagePath + 'component';
    configuration.sourceCv = source + packagePath + 'cv';
    configuration.sourceError = source + packagePath + 'error';
    configuration.sourceInput = source + packagePath + 'input';
    configuration.sourceOutput = source + packagePath + 'output';
    configuration.sourceRefine = source + packagePath + 'refine';
    configuration.sourcePlugin = source + packagePath + 'plugin';
    // 资源文件目录
    configuration.resourcePlugin = resource + `/plugin/${module}`;
    configuration.resourceLog = resource + `/plugin/${module}/annal`;

    return configuration;
}
const detectWith = (modulePath, module, ...fnPlugin) => {
    let configuration = detectMaven(modulePath);
    if (module) {
        configuration.module = module;
    }
    for (let idx = 0; idx < fnPlugin.length; idx++) {
        const detectFn = fnPlugin[idx];
        if (U.isFunction(detectFn)) {
            // 会被改掉
            configuration = detectFn(modulePath, configuration);
        }
    }
    return configuration;
}
const javaConfig = (config = {}, path, ...fnPlugins) => {
    const {
        filename,
        module,
        tpl,
    } = config;
    let modulePath = path;
    const inputConfig = __IO.ioJObject(filename);
    const {ZF, ...prepared} = inputConfig;
    if (!modulePath) {
        modulePath = ZF;
    }
    __FX.fxError(!modulePath, 10029, modulePath, 'ZF');
    if (modulePath) {
        __LOG.info(`「Java环境」，后端工作路径：${modulePath.red}。`);
        const configuration = detectWith.apply(this, [modulePath, module].concat(fnPlugins));
        if (configuration) {
            __LOG.info(`Zero AI `.cyan + ` 0. 基础环境......`.rainbow);
            __LOG.info(`Zero AI `.cyan + ` 工作目录：${modulePath.blue}`);
            configuration.input = prepared;
            configuration.tpl = tpl;
            return configuration;
        }
    }
}
const javaSmartMod = (path = ".") => {
    // 目录基础检查
    const pathStart = __IO.ioSwitch(path);
    const pathFile = `${pathStart}/initialize.json`;
    __FX.fxError(!__IO.isExist(pathFile), 10035, path);
    // 查找带有 pom.xml 的根路径
    __LOG.info(`Zero AI `.cyan + ` 检索模块目录构造配置信息。`);
    const modulePath = __SK.seekResource(path);
    // 构造模块规范，查找目录设置
    const configuration = {};
    configuration.pathBase = modulePath;
    configuration.path = pathStart;
    configuration.out = pathFile;
    configuration.prefix = pathStart.replace(`${modulePath}/`, "");
    return configuration;
}
module.exports = {
    Cfg: {
        detectOx,
        detectPlugin,
    },
    javaConfig,
    javaSmartMod,
}