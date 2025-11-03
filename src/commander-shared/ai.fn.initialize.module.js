const Ec = require('../epic');
const fs = require("fs");
const Io = require("./ai.fn.initialize.zero.directory");
const {ioStructureDPA} = require("./ai.fn.initialize.zero.directory");

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
    configMap.dbType = "MYSQL";

    const configInput = process.cwd() + `/${parsed.config}`;
    if (!fs.existsSync(configInput)) {
        Ec.warn(`配置文件不存在，使用默认配置！路径 = ` + configInput.blue);
    }
    return configMap;
}
const initMod = async (configuration = {}) => {
    const type = configuration.srcType;


    // 1. 先创建基本目录
    Ec.execute("----------- 目录创建 -----------");
    const baseDir = configuration.srcOut;
    const created = await Io.ioDPAStructure(baseDir, configuration);
    if (!(created.every(item => true === item))) {
        Ec.error(`目录初始化异常：${configuration.srcOut}`)
    }

    Ec.execute("----------- 文件生成 -----------");
    // 2. 每个项目的 pom.xml 文件初始化
    const sourceTpl = Ec.ioRoot() + "/_template/" + type.description;
    const genPom = await Io.ioDPAPom(sourceTpl, configuration);
    if (!genPom) {
        Ec.error(`pom.xml 文件生成异常：${configuration.srcOut}`)
    }
    Ec.execute("----------- 数据库初始化 -----------");


    // 3. 数据库文件初始化
    const genDatabase = await Io.ioModuleDatabase(sourceTpl, configuration);
    if (!genDatabase) {
        Ec.error(`数据库文件生成异常：${configuration.srcOut}`)
    }


    // 4. 代码生成文件初始化
    Ec.execute("----------- 代码生成 -----------");
    const genModule = await Io.ioModuleConfiguration(sourceTpl, configuration);
    if (!genModule) {
        Ec.error(`代码文件生成异常：${configuration.srcOut}`)
    }
    const genSource = await Io.ioModuleSource(sourceTpl, configuration);
    if (!genSource) {
        Ec.error(`源代码文件生成异常：${configuration.srcOut}`)
    }
}

module.exports = {
    initMod,
    initConfiguration,
}