const Io = require('./ai.export.io');
const Word = require('./ai.export.word');
const Log = require('./ai.export.log');
const path = require('path');
const fs = require('fs');
const writeFile = (config, params = {}) => {
    const { source, target } = config;
    if(fs.existsSync(source) && target){
        const content = Io.ioString(source);
        const normalized = Word.strExpr(content, params);
        Io.outString(target, normalized, true);
    }else{
        Log.warn(`Zero AI 对不起，文件不存在`.yellow + `：${source}`);
    }
}
const writeDir = (config = {}) => {
    Log.info(`Zero AI `.cyan + ` \t1.1. 初始化源代码目录......`);
    Object.keys(config)
        .filter(key => key.startsWith("source"))
        .map(field => config[field])
        .forEach(Io.dirCreate);

    Log.info(`Zero AI `.cyan + ` \t1.2. 初始化资源目录......`);
    Object.keys(config)
        .filter(key => key.startsWith("resource"))
        .map(field => config[field])
        .forEach(Io.dirCreate);
}
const fileRaw = (targetFile, tplFile, filename, filenameTpl) => {
    const file = {};
    file.target = `${targetFile}/${filename}`;
    const fileTpl = filenameTpl ? filenameTpl: `${filename}.tpl`;
    file.source = `${tplFile}/${fileTpl}`;
    return file;
}
const fileInfix = (targetFile, tplFile, input = {}) => {
    Log.info(`Zero AI `.cyan + ` \t2.1. backlog日志配置......`);
    const content = fileRaw(targetFile, tplFile, 'infix.xml');
    const { params = {}} = input;
    writeFile(content, params);
}

const fileConfiguration = (resourcePath, tplFile, input = {}) => {
    const { params = {}} = input;
    Log.info(`Zero AI `.cyan + ` \t2.2.1. 「默认」集成配置......`);
    let json = fileRaw(resourcePath, tplFile,
        "integration.json");
    writeFile(json, params);

    Log.info(`Zero AI `.cyan + ` \t2.2.2. 「开发」集成配置......`);
    json = fileRaw(resourcePath, tplFile,
        "integration-dev.json", "integration.json.tpl");
    writeFile(json, params);

    Log.info(`Zero AI `.cyan + ` \t2.2.3. 「生产」集成配置......`);
    json = fileRaw(resourcePath, tplFile,
        "integration-prod.json", "integration.json.tpl");
    writeFile(json, params);

    Log.info(`Zero AI `.cyan + ` \t2.2.4. 基础配置......`);
    json = fileRaw(resourcePath, tplFile,
        "configuration.json");
    writeFile(json, params);
}

const fileJava = (tplFile, input = {}) => {
    const { params = {}, config = {}} = input;
    Log.info(`Zero AI `.cyan + ` \t2.3.1. 常量处理......`);
    let java = fileRaw(config.sourceCv, tplFile,
        `${config.moduleAlias}Cv.java`, `Cv.java.tpl`);
    writeFile(java, params);

    Log.info(`Zero AI `.cyan + ` \t2.3.2. Before/After 插件处理......`);
    java = fileRaw(config.sourcePlugin, tplFile,
        `Abstract${config.moduleAlias}Before.java`, `Plugin.Before.java.tpl`);
    writeFile(java, params);
    java = fileRaw(config.sourcePlugin, tplFile,
        `Abstract${config.moduleAlias}After.java`, `Plugin.After.java.tpl`);
    writeFile(java, params);

    Log.info(`Zero AI `.cyan + ` \t2.3.3. Refine 工具处理......`);
    java = fileRaw(config.sourceRefine, tplFile,
        `${config.moduleAlias}Log.java`, `Refine.Log.java.tpl`);
    writeFile(java, params);
    java = fileRaw(config.sourceRefine, tplFile,
        `${config.moduleAlias}Pin.java`, `Refine.Pin.java.tpl`);
    writeFile(java, params);
    java = fileRaw(config.sourceRefine, tplFile,
        `${config.moduleAlias}.java`, 'Refine.java.tpl');
    writeFile(java, params);

    Log.info(`Zero AI `.cyan + ` \t2.3.4. Error 异常类处理......`);
    java = fileRaw(config.sourceError, tplFile,
        `_501${config.moduleAlias}IoNullException.java`, `ErrorIo.java.tpl`);
    writeFile(java, params);


    Log.info(`Zero AI `.cyan + ` \t2.3.5. Component 通道组件......`);
    java = fileRaw(config.sourceComponent, tplFile,
        `Abstract${config.moduleAlias}Component.java`, `Component.java.tpl`);
    writeFile(java, params);

    Log.info(`Zero AI `.cyan + ` \t2.3.6. In 组件处理......`);
    java = fileRaw(config.sourceInput, tplFile,
        `${config.moduleAlias}In.java`, `In.java.tpl`);
    writeFile(java, params);

    java = fileRaw(config.sourceInput, tplFile,
        `Abstract${config.moduleAlias}In.java`, `In.Abstract.java.tpl`);
    writeFile(java, params);

    Log.info(`Zero AI `.cyan + ` \t2.3.7. Out 组件处理......`);
    java = fileRaw(config.sourceOutput, tplFile,
        `${config.moduleAlias}Io.java`, `Io.java.tpl`);
    writeFile(java, params);

    java = fileRaw(config.sourceOutput, tplFile,
        `Abstract${config.moduleAlias}Io.java`, `Io.Abstract.java.tpl`);
    writeFile(java, params);

    java = fileRaw(config.sourceOutput, tplFile,
        `${config.moduleAlias}IoAdd.java`, `Io.Impl.java.tpl`);
    writeFile(java, {OP:"Add",...params});
    java = fileRaw(config.sourceOutput, tplFile,
        `${config.moduleAlias}IoUpdate.java`, `Io.Impl.java.tpl`);
    writeFile(java, {OP:"Update",...params});
    java = fileRaw(config.sourceOutput, tplFile,
        `${config.moduleAlias}IoDelete.java`, `Io.Impl.java.tpl`);
    writeFile(java, {OP:"Delete",...params});
}

const pluginRun = (config = {}) => {
    Log.info(`Zero AI `.cyan + ` 1. 执行Plugin命令......`.rainbow);
    const { tpl = {}} = config;
    const tplPath = path.join(__dirname, `../cab/${tpl.type}`);
    writeDir(config);

    const params = {};
    Log.info(`Zero AI `.cyan + ` 2. 生成代码......`.rainbow);
    params.LOG_L = config.module;
    params.LOG_UP = config.module.toUpperCase();
    params.ALIAS = config.moduleAlias;
    params.PACKAGE = config.modulePackage;
    params.MODULE = config.module;

    const input = {};
    input.config = config;
    input.params = params;

    // src/main/resources/plugin/xxx/annal/infix.xml
    fileInfix(config.resourceLog, tplPath, input);
    // src/main/resources/plugin/xxx/configuration.json
    fileConfiguration(config.resourcePlugin, tplPath, input);
    // src/main/java 源代码
    fileJava(tplPath, input);
    Log.info(`Zero AI `.cyan + ` 3. 执行完成......`.rainbow);
}
module.exports = {
    pluginRun
}