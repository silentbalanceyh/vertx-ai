const Ec = require('../epic');
const fs = require("fs");
const Io = require("./ai.fn.initialize.io");
const {ioStructureDPA} = require("./ai.fn.initialize.io");

const initConfiguration = (parsed = {}) => {
    const module = parsed.module;
    const configMap = {};
    configMap.groupId = "io.zerows";
    configMap.artifactId = `zero-extension-${module}`;
    configMap.version = "1.0.0";
    configMap.srcPackage = `io.zerows.extension.${module}`;

    let output = parsed.output;
    if ('.' === output) {
        output = process.cwd();
    }
    configMap.srcId = module;
    configMap.srcOut = output;
    configMap.srcType = Symbol("SERVICE");
    configMap.srcConfig = parsed.config;

    const configInput = process.cwd() + `/${parsed.config}`;
    if (!fs.existsSync(configInput)) {
        Ec.warn(`配置文件不存在，使用默认配置！路径 = ` + configInput.blue);
    }
    return configMap;
}
const initMod = async (configuration = {}) => {
    const type = configuration.srcType;


    // 1. 先创建基本目录
    const baseDir = configuration.srcOut;
    const created = await Io.ioDPAStructure(baseDir, configuration.artifactId);
    if (!(created.every(item => true === item))) {
        Ec.error(`目录初始化异常：${configuration.srcOut}`)
    }

    // 2. 每个项目的 pom.xml 文件初始化
    const sourceTpl = Ec.ioRoot() + "/_template/" + type.description;
    const genPom = await Io.ioDPAPom(sourceTpl, configuration);

    // 3. 数据库文件初始化


    // 4. 代码生成文件初始化


    // 5. 启动文件初始化
}

module.exports = {
    initMod,
    initConfiguration,
}