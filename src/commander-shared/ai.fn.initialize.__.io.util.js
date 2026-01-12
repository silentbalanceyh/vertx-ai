const Ec = require("../epic");
const fs = require("fs");
const fsAsync = require("fs").promises;
const ejs = require("ejs");
const path = require("path");

const ioEJS = async (source, configuration = {}) => new Promise((resolve, reject) => {
    const params = {};
    /*
     * - group / Maven 对应的 groupId
     * - id / Maven 对应的 artifactId
     * - name / 模块名称，大写形式
     * - packageName / Java 包名称
     */
    params.id = configuration?.artifactId;
    params.name = configuration?.srcId.toUpperCase();
    params.packageName = configuration?.srcPackage;
    params.group = configuration?.groupId;
    params.framework = configuration?.framework;

    /*
     * 数据库部分
     * - dbName / 数据库实例名
     * - dbUser / 数据库用户名
     * - dbHost / 数据库域名
     * - dbPort / 数据库端口
     * - dbPassword / 数据库密码
     */
    params.dbType = configuration?.dbType;
    params.dbName = configuration?.dbName;
    params.dbUser = configuration?.dbUser;
    params.dbHost = configuration?.dbHost;
    params.dbPort = configuration?.dbPort;
    params.dbPassword = configuration?.dbPassword;

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
const withTest = (configuration = {}, path) => {
    return `${configuration.srcOut}/${configuration.artifactId}/${configuration.artifactId}-test/${path}`;
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

    return configMap;
}
const ioApp = async (configuration = {}) => {
    let configFile = process.cwd() + `\`/${configuration.srcConfig}`;
    const configDefault = process.cwd() + `/app.json`;
    if (!fs.existsSync(configFile)) {
        Ec.warn(`配置文件不存在，使用默认配置！路径 = ` + configDefault.blue);
        configFile = configDefault;
    }

    // 加载配置文件
    if (fs.existsSync(configFile)) {
        // 配置加载
        const configData = Ec.ioJObject(configFile);
        [
            "framework",        // 框架版本
            "dbHost",           // 数据库主机
            "dbPort",           // 数据库端口
            "dbUser",           // 数据库用户
            "dbPassword",       // 数据库密码
            "dbName",           // 数据库名称
            "groupId",          // Maven Group ID
            "artifactId",       // Maven Artifact ID
            "srcPackage"        // Java 包名称
        ].forEach(field => {
            if (configData.hasOwnProperty(field)) {
                configuration[field] = configData[field];
                Ec.execute("\t配置项覆盖：" + field + " = " + configData[field]);
            }
        })
    }
    return configuration;
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
const ioChmod = async (directory) => {
    try {
        // Ec.execute(`正在扫描目录：${directory}`);
        // 1. 目录读取
        const files = await fsAsync.readdir(directory, {withFileTypes: true});
        // 2. 筛选所有的 .sh 文件
        const chmodPromise = [];
        for (const file of files) {
            const fullPath = path.join(directory, file.name);
            if (file.isDirectory()) {
                // 递归处理子目录
                const subPromises = await ioChmod(fullPath);
                chmodPromise.push(...subPromises);
            } else if (file.isFile() && path.extname(file.name) === '.sh') {
                // 处理 .sh 文件
                const chmodPromiseItem = fsAsync.stat(fullPath)
                    .then(stat => {
                        const currentMode = stat.mode;
                        const newMode = currentMode
                            | fsAsync.constants.S_IXUSR
                            | fsAsync.constants.S_IXGRP
                            | fsAsync.constants.S_IXOTH;
                        return fsAsync.chmod(fullPath, newMode);
                    })
                    .then(() => {
                        Ec.execute(`${fullPath} 的执行权限已添加。`);
                    })
                    .catch(chmodErr => {
                        Ec.error(`修改 ${fullPath} 权限时发生错误: ${chmodErr.message}`);
                    });
                chmodPromise.push(chmodPromiseItem);
            }
        }

        // 等待所有 chmod 操作完成
        await Promise.all(chmodPromise);

        return chmodPromise;

    } catch (error) {
        Ec.error(`处理目录发生错误：${directory}`);
        throw error;
    }
}
const ioPackage = async (suffix, configuration, baseFn) => {
    const packageName = !!suffix ? configuration.srcPackage + `.${suffix}` : configuration.srcPackage;
    const pathPackage = packageName.replace(/\./g, "/");
    let dirPackage = baseFn(configuration, `src/main/java/${pathPackage}`);
    await fsAsync.mkdir(dirPackage, {recursive: true});
    await fsAsync.access(dirPackage, fsAsync.constants.F_OK);
    return pathPackage;
}
module.exports = {
    ioPackage,
    ioChmod,
    ioConfiguration,
    ioEJS,
    ioAppName,
    ioApp,
    withTest,
    withDomain,
    withProvider,
    withApi,
    withDPA,
}