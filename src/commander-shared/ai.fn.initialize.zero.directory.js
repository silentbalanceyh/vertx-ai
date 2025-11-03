const fs = require('fs');
const ejs = require('ejs');
const Ec = require('../epic');
const IoZero = require('./ai.fn.initialize.zero.file');
const IoUt = require('./ai.fn.initialize.io.__.util');
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
    const batched = folders.map(folder => new Promise((resolve, reject) => {
        Ec.execute("创建目录：" + folder);
        fs.mkdir(
            folder,
            {recursive: true},
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            }
        );
    }));
    return Promise.all(batched);
}
const ioStructureOne = (baseDir, name) => {

}

const ioDPAPom = async (source, configuration = {}) => {
    let fileSrc = `${source}/pom.xml.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withDPA(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/pom.xml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withApi(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-provider/pom.xml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withProvider(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-domain/pom.xml.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDomain(configuration, `pom.xml`);
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);
    return true;
}
module.exports = {
    ioDPAStructure,
    ioDPAPom,
    ioStructureOne,
    ...IoZero,
}