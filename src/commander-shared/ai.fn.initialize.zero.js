const fs = require("fs");
const Ec = require("../epic");
const IoUt = require("./ai.fn.initialize.__.io.util");
const Io = require("./ai.fn.initialize.__.zero.directory");
const initZeroConfiguration = async (parsed = {}) => {
    Ec.execute(`初始化 Zero 项目，${`zero-ecotope`.green} 版本：${parsed.versionZero.red}`);
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

    configuration.framework = parsed.versionZero || "1.0.0";
    await IoUt.ioApp(configuration);
    configuration.appName = configuration.id;
    // tenant, sigma, appId
    // 三个库的相关设置
    if(!configuration.appNs){
        configuration.appNs = configuration.group;
    }
    if(!configuration.appTenant){
        configuration.appTenant = Ec.strUuid();
    }
    if(!configuration.appSigma){
        configuration.appSigma = Ec.strRandom(32);
    }
    if(!configuration.appId){
        configuration.appId = Ec.strUuid();
    }
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

    Ec.execute("----------- 文件生成 -----------");
    // 2. 每个项目 pom.xml 文件初始化
    const type = configuration.srcType;
    const sourceTpl = Ec.ioRoot() + "/_template/" + type.description;
    const genPom = await Io.ioDPAZeroPom(sourceTpl, configuration);
    if (!genPom) {
        Ec.error(`pom.xml 文件生成异常：${configuration.srcOut}`)
    }

    // 3. 数据库文件初始化
    Ec.execute("----------- 数据库初始化 -----------");
    const genDatabase = await Io.ioZeroDatabase(sourceTpl, configuration);
    if (!genDatabase) {
        Ec.error(`数据库文件生成异常：${configuration.srcOut}`)
    }

    // 4. 代码生成文件初始化
    Ec.execute("----------- 代码生成 -----------");
    const genModule = await Io.ioZeroConfiguration(sourceTpl, configuration);
    if (!genModule) {
        Ec.error(`配置文件生成异常：${configuration.srcOut}`)
    }
    const genSource = await Io.ioZeroSource(sourceTpl, configuration);
    if (!genSource) {
        Ec.error(`源代码文件生成异常：${configuration.srcOut}`)
    }
    // 5. 权限变更
    const genChmod = await IoUt.ioChmod(configuration.srcOut + "/" + configuration.artifactId);
    if (!genChmod) {
        Ec.error(`权限变更异常：${configuration.srcOut}`)
    }
}
module.exports = {
    initZeroConfiguration,
    initZero,
}