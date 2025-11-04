const fs = require("fs").promises;
const Ec = require('../epic');
const IoZero = require('./ai.fn.initialize.__.zero.file');
const IoUt = require('./ai.fn.initialize.__.io.util');
const ioDPAStructure = async (baseDir, configuration) => {
    const name = configuration.artifactId;
    const folders = [
        `${baseDir}/${name}`,
        `${baseDir}/${name}/${name}-domain/database`,
        `${baseDir}/${name}/${name}-domain/src/main/java`,
        `${baseDir}/${name}/${name}-domain/src/main/resources/plugins/${name}`,
        `${baseDir}/${name}/${name}-domain/src/main/resources/plugins/${name}/database/${configuration.dbType}/`,
        `${baseDir}/${name}/${name}-domain/src/test/java`,
        `${baseDir}/${name}/${name}-domain/src/test/resources`,
        `${baseDir}/${name}/${name}-api/src/main/java`,
        `${baseDir}/${name}/${name}-api/src/main/resources`,
        `${baseDir}/${name}/${name}-api/src/test/java`,
        `${baseDir}/${name}/${name}-api/src/test/resources`,
        `${baseDir}/${name}/${name}-provider/src/main/java`,
        `${baseDir}/${name}/${name}-provider/src/main/resources`,
        `${baseDir}/${name}/${name}-provider/src/test/java`,
        `${baseDir}/${name}/${name}-provider/src/test/resources`,
    ];
    const results = [];
    folders.map(async (folder) => {
        Ec.execute("创建目录：" + folder);
        await fs.mkdir(folder, {recursive: true});
        results.push(true);
    })
    return results;
}

const ioDPAPom = async (source, configuration = {}) => {
    let fileSrc = `${source}/pom.xml.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withDPA(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/pom.xml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-provider/pom.xml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withProvider(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-domain/pom.xml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDomain(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);
    return true;
}
module.exports = {
    ioDPAStructure,
    ioDPAPom,
    ...IoZero,
}