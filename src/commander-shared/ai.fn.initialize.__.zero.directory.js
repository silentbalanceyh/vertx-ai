import {promises as fs} from "fs";

const Ec = require("../epic");

const ioDPAZeroStructure = async (baseDir, configuration) => {
    const name = configuration.artifactId;
    const folders = [
        `${baseDir}/${name}`,
        `${baseDir}/${name}/.r2mo/database/${configuration.dbType}/`,
        `${baseDir}/${name}/.r2mo/monitor/`,
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
        `${baseDir}/${name}/${name}-test/src/main/java`,
        `${baseDir}/${name}/${name}-test/src/main/resources`,
        `${baseDir}/${name}/${name}-test/src/test/java`,
        `${baseDir}/${name}/${name}-test/src/test/resources`,
    ];
    const results = [];
    folders.map(async (folder) => {
        Ec.execute("创建目录：" + folder);
        await fs.mkdir(folder, {recursive: true});
        results.push(true);
    })
    return results;
}
module.exports = {
    ioDPAZeroStructure,
}