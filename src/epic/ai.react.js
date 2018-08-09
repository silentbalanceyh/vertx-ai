const Io = require('./ai.io');
const E = require('./ai.error');
const Fx = require('./ai.fx');
const log = require('./ai.log');
const fs = require('fs');
const reactRoot = (path) => {
    const current = path ? `${process.cwd()}/${path}` : process.cwd();
    let root = Io.cycleParent(current, true);
    // 检查哪个目录中包含了package.json来判断根路径
    root = root.filter(item => fs.existsSync(`${item}/package.json`));
    Fx.fxTerminal(1 < root.length, E.fn10010(root));
    root = root[0];
    return Io.resolveDirectory(root);
};
const reactLanguage = () => {
    const root = reactRoot();
    const env = Io.ioProp(root + '/.env.development');
    return env['Z_LANGUAGE'];
};
const _reactRoot = (actual = {}, filename, error = true, type = "components") => {
    const result = {};
    if ('.' === actual['ui']) {
        log.info(`Branch, 当前目录：${actual['ui'].yellow}`);
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
        result.pathZero = `${folders[4]}/.zero/react/${result.pathPage.replace(/\//g, '.')}.${filename}.zero`;
    } else {
        log.info(`Branch, 指定目录：${actual['ui'].yellow}`);
        const pkg = process.cwd() + '/package.json';
        if (error) {
            Fx.fxTerminal(!Io.isExist(pkg), E.fn10017(process.cwd()));
        }
        // 判断actual.name是否符合规范
        let path = actual['ui'].replace(/\./g, '/');
        const prefix = `src/${type}`;
        result.pathPage = '/' + path;
        // 语言文件
        const env = Io.ioProp(process.cwd() + '/.env.development');
        const language = env['Z_LANGUAGE'];
        result.language = language;
        if (path.startsWith(prefix)) {
            result.pathComponent = Io.resolveDirectory(process.cwd()) + `/` + path;
            result.pathResource = Io.resolveDirectory(process.cwd() + `/src/cab/${language}`)
                + '/' + path.replace("src/", "");
        } else {
            result.pathComponent = Io.resolveDirectory(process.cwd()) + `/src/${type}/` + path;
            result.pathResource = Io.resolveDirectory(process.cwd() + `/src/cab/${language}/${type}`)
                + '/' + path;
        }
        result.namespace = result.pathComponent.split('src')[1];
        result.pathZero = `${process.cwd()}/.zero/react/${result.pathPage.replace(/\//g, '.')}.${filename}.zero`;
    }
    if (result.namespace.trim().startsWith('/')) {
        result.namespace = result.namespace.trim().substring(1, result.namespace.length);
    }
    result.fileJs = filename + '.js';
    result.fileJson = filename + '.json';
    result.fileCab = "Cab.json";
    result.fileLess = "Cab.less";
    result.fileOp = 'Op.ts';
    result.fileTypes = "Act.Types.js";
    result.fileEpic = "Act.Epic.js";
    // 文件名
    log.info(`Component, 生成组件目录：${result.pathComponent.blue}`);
    log.info(`Page, 生成页面文件目录：${result.pathPage}`);
    log.info(`Resource, 生成资源文件目录：${result.pathResource.green}`);
    log.info(`使用的语言代码：${result.language.red}`);
    log.info(`==> 将创建UI文件：${result.fileJs.blue} / ${result.fileJson.green}`);
    log.info(`==> 将创建Epic文件：${result.fileTypes.blue} / ${result.fileEpic.green}`);
    log.info(`==> 将创建Op文件：${result.fileOp.yellow}`);
    log.info(`==> 将创建Less文件：${result.fileLess.red}`);
    // 递归创建目录
    Io.makeDirs(result.pathComponent);
    return result;
};
const reactComponentRoot = (actual = {}, filename, type = "components") =>
    _reactRoot(actual, filename, true, type);
const reactResourceRoot = (actual = {}, filename, type = "components") =>
    _reactRoot(actual, filename, false, type);
const reactFileAnalyze = (files = "", config = {}) => {
    files = files.split(',');
    const finalFiles = [];
    files.forEach(file => {
        if (file.startsWith("UI")) {
            finalFiles.push(`${file}.js`);
            finalFiles.push(`${file}.json`);
        }
        if (file.startsWith("Op")) {
            finalFiles.push(`${file}.ts`);
        }
    });
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            if (key.startsWith("file")) {
                finalFiles.push(config[key]);
            }
        }
    }
    // 设置最终文件
    const formated = {};
    finalFiles.forEach(file => {
        if (file.endsWith("json") && !file.startsWith("Cab")) {
            formated[file] = config.pathResource + '/' + file;
        } else {
            formated[file] = config.pathComponent + '/' + file;
        }
    });
    return formated;
};
const reactTpl = (root) => {
    if (root) {
        const path = root + '/tpl/init';
        const dir = fs.readdirSync(path);
        const dirData = {};
        dir.forEach(item => {
            const key = item.replace(/.tz/g, "");
            dirData[key] = Io.ioString(path + '/' + item);
        });
        return dirData;
    }
};
const reactOp = (children = []) => {
    let line = "";
    if (0 === children.length) {
        line += "export default {\n";
    } else {
        const define = [];
        children.forEach(child => {
            const name = child
                .substring(0, child.lastIndexOf('.'))
                .replace(/\./g, "_").toUpperCase();
            line += `import ${name} from './${child.substring(0, child.lastIndexOf('.'))}';\n`;
            define.push(name);
        });
        line += "export default {\n";
        define.forEach(each => {
            line += `    ...${each},\n`;
        })
    }
    line += "}";
    return line;
};
module.exports = {
    reactRoot,
    reactTpl,
    reactOp,
    reactLanguage,
    reactComponentRoot,
    reactFileAnalyze,
    reactResourceRoot
};