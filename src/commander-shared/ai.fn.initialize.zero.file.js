const fs = require("fs");
const Ec = require("../epic");
const ejs = require("ejs");
const IoUt = require("./ai.fn.initialize.io.__.util");
const ioModuleDatabase = async (source, configuration = {}) => {
    let fileSrc = `${source}/database/database-reinit.sh`;
    let fileDest = IoUt.withDomain(configuration, `database/database-reinit.sh`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit.sql`;
    fileDest = IoUt.withDomain(configuration, `database/database-reinit.sql`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/database/init-db.sh`;
    fileDest = IoUt.withDomain(configuration, `init-db.sh`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);

    const databaseType = configuration.dbType;
    fileSrc = `${source}/database/${databaseType}.properties`;
    fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}/database/${databaseType}.properties`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/database/${databaseType}.yml`;
    fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}/database/${databaseType}.yml`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/.placeholder`;
    fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}/database/${databaseType}/.placeholder`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);
    return true;
}

const ioModuleConfiguration = async (source, configuration = {}) => {
    let fileSrc = `${source}/source-domain/configuration.yml.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}.yml`);
    await fs.writeFile(fileDest, fileContent, null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/.placeholder`;
    fileDest = IoUt.withDomain(configuration, `src/main/resources/plugins/${configuration.artifactId}/.placeholder`);
    await fs.copyFile(fileSrc, fileDest, (err) => err ? Ec.error(err) : null);
    Ec.execute("拷贝文件：" + fileDest.green);
    return true;
}

const ioModuleSource = async (source, configuration = {}) => {
    const pathPackage = configuration.srcPackage.replace(/\./g, "/");
    await fs.mkdir(pathPackage, {recursive: true}, (err) => err ? Ec.error(err) : null);
    let fileSrc = `${source}/source-domain/ExtensionGeneration.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withDomain(configuration, `src/main/java/${pathPackage}/Extension${configuration.srcId.toUpperCase()}Generation.java`);
    await fs.writeFile(fileDest, fileContent, null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);
    
    return true;
}
module.exports = {
    ioModuleDatabase,
    ioModuleConfiguration,
    ioModuleSource,
}