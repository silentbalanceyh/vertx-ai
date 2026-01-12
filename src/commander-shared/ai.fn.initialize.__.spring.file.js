const fs = require("fs").promises;
const Ec = require("../epic");
const IoUt = require("./ai.fn.initialize.__.io.util");

const ioSpringDatabase = async (source, configuration = {}) => {
    let fileSrc = `${source}/database/database-reinit.sql.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withDPA(configuration, `database/database-reinit.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/database/database-account.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDPA(configuration, `database/database-account.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/database/init-db.sh`;
    fileDest = IoUt.withDPA(configuration, "init-db.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    return true;
}
const ioSpringConfiguration = async (source, configuration = {}) => {
    let fileSrc = `${source}/mvn-build.sh`;
    let fileDest = IoUt.withDPA(configuration, "mvn-build.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/mvn-env.sh.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDPA(configuration, `mvn-env.sh`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/env.properties.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `src/main/resources/env.properties`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/application.yml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, "src/main/resources/application.yml");
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    return true;
}
const ioSpringSource = async (source, configuration = {}) => {
    let pathPackage = await IoUt.ioPackage("test", configuration, IoUt.withTest)

    let fileSrc = `${source}/.placeholder`;
    let fileDest = IoUt.withTest(configuration, `src/main/java/${pathPackage}/.placeholder`);
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    // 数据库脚本文件占位符
    fileDest = IoUt.withDomain(configuration,
        `src/main/resources/${configuration.artifactId}/database/schema/.placeholder`);
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    // ActOperationCommon
    pathPackage = await IoUt.ioPackage("base", configuration, IoUt.withDomain);
    fileSrc = `${source}/source-domain/ActOperationCommon.ejs`;
    fileDest = IoUt.withDomain(configuration, `src/main/java/${pathPackage}/ActOperationCommon.java`);
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    // GenConfigAppXXXX
    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withDomain);
    fileSrc = `${source}/source-domain/GenConfigApp.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDomain(configuration, `src/main/java/${pathPackage}/GenConfigApp${configuration.srcId.toUpperCase()}.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    // GenAppModule
    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withProvider);
    fileSrc = `${source}/source-provider/GenAppModule.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withProvider(configuration, `src/main/java/${pathPackage}/GenApp${configuration.srcId.toUpperCase()}Module.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    // AppDev
    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withApi);
    fileSrc = `${source}/source-api/AppDev.java.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `src/main/java/${pathPackage}/${configuration.srcId.toUpperCase()}AppDev.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    // Application
    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withApi);
    fileSrc = `${source}/source-api/Application.java.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `src/main/java/${pathPackage}/${configuration.srcId.toUpperCase()}Application.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    return true;
}
module.exports = {
    ioSpringDatabase,
    ioSpringConfiguration,
    ioSpringSource,
}