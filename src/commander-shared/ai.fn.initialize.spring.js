const fs = require("fs");
const Ec = require("../epic");
const IoUt = require("./ai.fn.initialize.__.io.util");
const Io = require("./ai.fn.initialize.__.spring.directory");
const initSpringConfiguration = async (parsed = {}) => {
    Ec.execute(`初始化 Spring 项目，${`r2mo-rapid`.green} 版本：${parsed.versionR2mo.red}`);
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
    configuration.dbHost = "localhost";
    configuration.dbPort = 3306;

    // Spring 的基础是 r2mo-rapid 核心框架
    configuration.framework = parsed.versionR2mo || "1.0.0";
    await IoUt.ioApp(configuration);
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
    if (!genPom) {
        Ec.error(`pom.xml 文件生成异常：${configuration.srcOut}`)
    }


    // 3. 数据库文件初始化
    Ec.execute("----------- 数据库初始化 -----------");
    const genDatabase = await Io.ioSpringDatabase(sourceTpl, configuration);
    if (!genDatabase) {
        Ec.error(`数据库文件生成异常：${configuration.srcOut}`)
    }


    // 4. 代码生成文件初始化
    Ec.execute("----------- 代码生成 -----------");
    const genModule = await Io.ioSpringConfiguration(sourceTpl, configuration);
    if (!genModule) {
        Ec.error(`配置文件生成异常：${configuration.srcOut}`)
    }
    const genSource = await Io.ioSpringSource(sourceTpl, configuration);
    if (!genSource) {
        Ec.error(`源代码文件生成异常：${configuration.srcOut}`)
    }
    // 5. 权限变更
    const genChmod = await IoUt.ioChmod(configuration.srcOut + `/` + configuration.artifactId);
    if (!genChmod) {
        Ec.error(`权限变更异常：${configuration.srcOut}`)
    }
}
module.exports = {
    initSpringConfiguration,
    initSpring,
}