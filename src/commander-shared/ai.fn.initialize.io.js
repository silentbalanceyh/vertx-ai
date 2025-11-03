const fs = require('fs');
const ejs = require('ejs');
const Ec = require('../epic');
const {config} = require("exceljs");
const ioDPAStructure = async (baseDir, name) => {
    const folders = [
        `${baseDir}/${name}`,
        `${baseDir}/${name}/${name}-domain`,
        `${baseDir}/${name}/${name}-api`,
        `${baseDir}/${name}/${name}-provider`
    ];
    const batched = folders.map(folder => new Promise((resolve, reject) =>
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
        ))
    );
    return Promise.all(batched);
}
const ioDPAPomItem = async (source, configuration = {}) => new Promise((resolve, reject) => {
    const params = {};
    params.id = configuration?.artifactId;
    params.name = configuration?.srcId.toUpperCase();

    Ec.execute(`读取 EJS 模版：${source.blue}`)
    fs.readFile(source, "utf8", (err, data) => {
        if (err) {
            reject(err);
        }
        // 渲染模板
        const renderContent = ejs.render(data, params);
        resolve(renderContent);
    });
})
const ioStructureOne = (baseDir, name) => {

}

const ioDPAPom = async (source, configuration = {}) => {
    let fileSrc = `${source}/pom.xml.ejs`;
    let fileContent = await ioDPAPomItem(fileSrc, configuration);
    let fileDest = `${configuration.srcOut}/${configuration.artifactId}/pom.xml`;
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-api/pom.xml.ejs`;
    fileContent = await ioDPAPomItem(fileSrc, configuration);
    fileDest = `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-api/pom.xml`;
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-provider/pom.xml.ejs`;
    fileContent = await ioDPAPomItem(fileSrc, configuration);
    fileDest = `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-provider/pom.xml`;
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/source-domain/pom.xml.ejs`;
    fileContent = await ioDPAPomItem(fileSrc, configuration);
    fileDest = `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-domain/pom.xml`;
    await fs.writeFile(fileDest, fileContent.toString(), null, (err) => err ? Ec.error(err) : null);
    Ec.execute("生成文件：" + fileDest.green);
    return true;
}
module.exports = {
    ioDPAStructure,
    ioDPAPom,
    ioStructureOne,
}