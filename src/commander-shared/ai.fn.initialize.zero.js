const fs = require("fs");
const Ec = require("../epic");
const IoUt = require("./ai.fn.initialize.__.io.util");
const Io = require("./ai.fn.initialize.__.zero.directory");
const initZeroConfiguration = async (parsed = {}) => {
    Ec.execute(`初始化 Spring 项目，${`r2mo-rapid`.green} 版本：${parsed.versionR2mo.red}`);
    const name = parsed.name;
    const configuration = IoUt.ioConfiguration(parsed, name);
    configuration.groupId = "io.zerows.apps";
    const appName = IoUt.ioAppName(name);
    configuration.srcPackage = `io.zerows.apps.zero.${appName}`;
    configuration.srcId = appName;
    configuration.srcType = Symbol("ZERO");

    configuration.dbName = "DB_ZERO_" + appName.toUpperCase();
    configuration.dbUser = appName;
    configuration.dbPassword = appName;
    configuration.dbHost = "localhost";
    configuration.dbPort = 3306;

    // Spring 的基础是 r2mo-rapid 核心框架
    configuration.framework = parsed.versionR2mo || "1.0.0";
    await IoUt.ioApp(configuration);
    return configuration;
}
const initZero = async (configuration = {}) => {
    // 1. 先创建基本目录
    Ec.execute("----------- 目录创建 -----------");
    const baseDir = configuration.srcOut;
    const created = await Io.ioDPAZeroStructure(baseDir, configuration);
    if (!(created.every(item => true === item))) {
        Ec.error(`目录初始化异常：${configuration.srcOut}`)
    }
}
module.exports = {
    initZeroConfiguration,
    initZero,
}