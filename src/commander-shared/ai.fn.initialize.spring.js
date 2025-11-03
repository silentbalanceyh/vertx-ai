const fs = require("fs");
const Ec = require("../epic");
const IoUt = require("./ai.fn.initialize.__.io.util");
const Io = require("./ai.fn.initialize.__.spring.directory");
const initSpringConfiguration = (parsed = {}) => {
    const name = parsed.name;
    const configuration = IoUt.ioConfiguration(parsed, name);
    configuration.groupId = "io.zerows.apps";
    const appName = IoUt.ioAppName(name);
    configuration.srcPackage = `io.zerows.apps.spring.${appName}`;
    configuration.srcId = appName;
    configuration.srcType = Symbol("SPRING");

    configuration.dbName = "DB_SPRING_" + appName.toUpperCase();
    configuration.dbUser = appName;
    configuration.dbPassword = appName;
    return configuration;
}
const initSpring = async (configuration = {}) => {
    // 1. 先创建基本目录
    Ec.execute("----------- 目录创建 -----------");
    const baseDir = configuration.srcOut;
    const created = await Io.ioDPASpringStructure(baseDir, configuration);
    if (!(created.every(item => true === item))) {
        Ec.error(`目录初始化异常：${configuration.srcOut}`)
    }

    Ec.execute("----------- 文件生成 -----------");
    // 2. 每个项目的 pom.xml 文件初始化
    const type = configuration.srcType;
    const sourceTpl = Ec.ioRoot() + "/_template/" + type.description;
    const genPom = await Io.ioDPASpringPom(sourceTpl, configuration);
    return null;
}
module.exports = {
    initSpringConfiguration,
    initSpring,
}