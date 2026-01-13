const fs = require("fs").promises;

const IoUt = require("./ai.fn.initialize.__.io.util");
const Ec = require("../epic");
const ioZeroDatabase = async (source, configuration = {}) => {
    let fileSrc = `${source}/database/database-account.sql.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withApi(configuration, `.r2mo/database/${configuration.dbType}/database-account.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `.r2mo/database/${configuration.dbType}/database-reinit.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件/DB：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit-workflow.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `.r2mo/database/${configuration.dbType}/database-reinit-workflow.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件/WF：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit-history.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `.r2mo/database/${configuration.dbType}/database-reinit-history.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件/HIS：" + fileDest.green);

    fileSrc = `${source}/database/mvn-db.sh`;
    fileDest = IoUt.withApi(configuration, "mvn-db.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/database/mvn-schema.sh`;
    fileDest = IoUt.withDomain(configuration, "mvn-schema.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    return true;
}
const ioZeroConfiguration = async (source, configuration = {}) => {
    let fileSrc = `${source}/mvn-build.sh`;
    let fileDest = IoUt.withDPA(configuration, "mvn-build.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/app.env.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `.r2mo/app.env`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/vertx.yml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, "src/main/resources/vertx.yml");
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/env.properties.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, "src/main/resources/env.properties");
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/flyway.conf`;
    fileDest = IoUt.withDomain(configuration, "src/main/resources/flyway.conf");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);
    return true;
}
const ioZeroSource = async (source, configuration = {}) => {
    let pathPackage = await IoUt.ioPackage("test", configuration, IoUt.withTest)

    let fileSrc = `${source}/.placeholder`;
    let fileDest = IoUt.withTest(configuration, `src/main/java/${pathPackage}/.placeholder`);
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    // 数据库脚本文件占位符
    fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}/database/${configuration.dbType}/.placeholder`);
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}/flyway/${configuration.dbType}/.placeholder`);
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withDomain);
    fileSrc = `${source}/source-domain/ModuleGeneration.java.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDomain(configuration, `src/main/java/${pathPackage}/Module${configuration.srcId.toUpperCase()}Generation.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withProvider);
    fileSrc = `${source}/source-provider/ModuleSource.java.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withProvider(configuration, `src/main/java/${pathPackage}/Module${configuration.srcId.toUpperCase()}Source.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-provider/vertx-generate.yml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withProvider(configuration, `src/main/resources/vertx-generate.yml`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    // AppDev
    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withApi);
    fileSrc = `${source}/source-api/AppDev.java.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `src/main/java/${pathPackage}/${configuration.srcId.toUpperCase()}Dev.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    // Application
    pathPackage = await IoUt.ioPackage(null, configuration, IoUt.withApi);
    fileSrc = `${source}/source-api/Application.java.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `src/main/java/${pathPackage}/${configuration.srcId.toUpperCase()}App.java`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);
    return true;
}
module.exports = {
    ioZeroDatabase,
    ioZeroConfiguration,
    ioZeroSource,
}