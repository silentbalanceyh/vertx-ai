const Io = require('./ai.io');
const E = require('./ai.error');
const Fx = require('./ai.fx');
const log = require('./ai.log');
const fs = require('fs');
const reactRoot = () => {
    const current = process.cwd();
    let root = Io.cycleParent(current, true);
    // 检查哪个目录中包含了package.json来判断根路径
    root = root.filter(item => fs.existsSync(`${item}/package.json`));
    Fx.fxTerminal(1 < root.length, E.fn10010(root));
    root = root[0];
    return Io.resolveDirectory(root);
};
const _reactRoot = (actual = {}, filename, error = true, type = "components") => {
    const result = {};
    if ('.' === actual.name) {
        // 从子目录直接创建
        const folders = Io.cycleParent(process.cwd(), true);
        // folder中的元素，往上走两级，必须以src/components结尾
        const target = Io.resolveDirectory(folders[2]);
        Fx.fxTerminal(!target.endsWith(`src/${type}`), E.fn10016(process.cwd()));
        result.pathComponent = Io.resolveDirectory(folders[0]);
        result.pathPage = result.pathComponent.split(`src/${type}`)[1];
        result.namespace = result.pathComponent.split(`src`)[1];
        // 读取语言文件
        const env = Io.ioProp(folders[4] + '/.env.development');
        const language = env['Z_LANGUAGE'];
        // 资源文件处理
        result.language = language;
        result.pathResource = Io.resolveDirectory(folders[4]) + `/src/cab/${language}/${type}`
            + folders[0].split(`src/${type}`)[1];
        result.fileZero = `${folders[4]}/.zero/react/${result.pathPage.replace(/\//g, '.')}.${filename}.zero`;
    } else {
        const pkg = process.cwd() + '/package.json';
        if (error) {
            Fx.fxTerminal(!Io.isExist(pkg), E.fn10017(process.cwd()));
        }
        // 判断actual.name是否符合规范
        const path = actual.name.replace(/\./g, '/');
        result.pathPage = '/' + path;
        result.pathComponent = Io.resolveDirectory(process.cwd()) + `/src/${type}/` + path;
        result.namespace = result.pathComponent.split('src')[1];
        // 语言文件
        const env = Io.ioProp(process.cwd() + '/.env.development');
        const language = env['Z_LANGUAGE'];
        result.language = language;
        result.pathResource = Io.resolveDirectory(process.cwd() + `/src/cab/${language}/${type}`)
            + '/' + path;
        result.fileZero = `${process.cwd()}/.zero/react/${result.pathPage.replace(/\//g, '.')}.${filename}.zero`;
    }
    result.fileJs = filename + '.js';
    result.fileJson = filename + '.json';
    result.fileCab = "Cab.json";
    result.fileLess = "Cab.less";
    result.fileOp = 'Op.ts';
    // 文件名
    log.info(`Component, 生成组件目录：${result.pathComponent.blue}`);
    log.info(`Page, 生成页面文件目录：${result.pathPage}`);
    log.info(`Resource, 生成资源文件目录：${result.pathResource.green}`);
    log.info(`使用的语言代码：${result.language.red}`);
    log.info(`将要创建的文件名：${result.fileJs.blue} / ${result.fileJson.green}`);
    // 递归创建目录
    Io.makeDirs(result.pathComponent);
    return result;
};
const reactComponentRoot = (actual = {}, filename, type = "components") =>
    _reactRoot(actual, filename, true, type);
const reactResourceRoot = (actual = {}, filename, type = "components") =>
    _reactRoot(actual, filename, false, type);
module.exports = {
    reactRoot,
    reactComponentRoot,
    reactResourceRoot
};