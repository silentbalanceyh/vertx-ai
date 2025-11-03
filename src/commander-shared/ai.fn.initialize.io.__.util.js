const Ec = require("../epic");
const fs = require("fs");
const ejs = require("ejs");

const ioEJS = async (source, configuration = {}) => new Promise((resolve, reject) => {
    const params = {};
    params.id = configuration?.artifactId;
    params.name = configuration?.srcId.toUpperCase();
    params.packageName = configuration?.srcPackage;

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
const withDomain = (configuration = {}, path) => {
    return `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-domain/${path}`;
}
const withProvider = (configuration = {}, path) => {
    return `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-provider/${path}`;
}
const withApi = (configuration = {}, path) => {
    return `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-api/${path}`;
}
const withDPA = (configuration = {}, path) => {
    return `${configuration.srcOut}/${configuration.artifactId}/${path}`;
}
module.exports = {
    ioEJS,
    withDomain,
    withProvider,
    withApi,
    withDPA,
}