const Ec = require("../epic");
const fs = require("fs");
const ejs = require("ejs");

const ioEJS = async (source, configuration = {}) => new Promise((resolve, reject) => {
    const params = {};
    params.id = configuration?.artifactId;
    params.name = configuration?.srcId.toUpperCase();
    params.packageName = configuration?.srcPackage;
    params.group = configuration?.groupId;

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
const ioConfiguration = (parsed = {}, name) => {
    const configMap = {};
    configMap.groupId = "io.zerows";
    configMap.artifactId = name;
    configMap.srcPackage = `io.zerows.extension.${name}`;

    let output = parsed.output;
    if ('.' === output) {
        output = process.cwd();
    }
    configMap.srcId = name;
    configMap.srcOut = output;
    configMap.srcConfig = parsed.config;
    configMap.dbType = "MYSQL";

    const configInput = process.cwd() + `/${parsed.config}`;
    if (!fs.existsSync(configInput)) {
        Ec.warn(`配置文件不存在，使用默认配置！路径 = ` + configInput.blue);
    }

    if (fs.existsSync(configInput)) {
        // 有配置的情况要合并配置
        const data = Ec.ioJObject(configInput);
        Object.assign(configMap, data);
    }
    return configMap;
}
const ioAppName = (name) => {
    let appName;
    if (0 < name.indexOf("-")) {
        appName = name.substring(name.lastIndexOf("-") + 1);
    } else if (0 < name.indexOf(".")) {
        appName = name.substring(name.lastIndexOf(".") + 1);
    } else {
        appName = name;
    }
    return appName;
}
module.exports = {
    ioConfiguration,
    ioEJS,
    ioAppName,
    withDomain,
    withProvider,
    withApi,
    withDPA,
}