const Io = require('./ai.io');
const Fx = require('./ai.fx');
const log = require('./ai.log');
const Word = require('./ai.word');
const fs = require('fs');
const path = require('path');
const SEPRATOR = path.sep;
const reactRoot = (path) => {
    const current = path ? `${process.cwd()}${SEPRATOR}${path}` : process.cwd();
    let root = Io.dirParent(current, true);
    // 检查哪个目录中包含了package.json来判断根路径
    root = root.filter(item => fs.existsSync(`${item}${SEPRATOR}package.json`));
    Fx.fxError(1 < root.length, 10010, root);
    root = root[0];
    return Io.dirResolve(root);
};
const reactLanguage = () => {
    const root = reactRoot();
    const env = Io.ioProp(root + SEPRATOR + '.env.development');
    return env['Z_LANGUAGE'];
};
const _reactRoot = (actual = {}, filename, error = true, type = "components") => {
        const result = {};
        const reg = new RegExp(SEPRATOR, "g");
        if ('.' === actual['ui']) {
            log.info(`Branch, 当前目录：${actual['ui'].yellow}`);
            // 从子目录直接创建
            const folders = Io.dirParent(process.cwd(), true);
            // folder中的元素，往上走两级，必须以src/components结尾
            const target = Io.dirResolve(folders[2]);
            Fx.fxError(!target.endsWith(`src${SEPRATOR}${type}`), 10016, process.cwd());
            result.pathComponent = Io.dirResolve(folders[0]);
            result.pathPage = result.pathComponent.split(`src${SEPRATOR}${type}`)[1];
            result.namespace = result.pathComponent.split(`src`)[1];
            // 读取语言文件
            const env = Io.ioProp(folders[4] + SEPRATOR + '.env.development');
            const language = env['Z_LANGUAGE'];
            // 资源文件处理
            result.language = language;
            result.pathResource = Io.dirResolve(folders[4]) + `${SEPRATOR}src${SEPRATOR}cab${SEPRATOR}${language}/${type}`
                + folders[0].split(`src${SEPRATOR}${type}`)[1];
            result.pathZero = `${folders[4]}${SEPRATOR}.zero${SEPRATOR}react${SEPRATOR}${result.pathPage.replace(reg, '.')}.${filename}.zero`;
        } else {
            log.info(`Branch, 指定目录：${actual['ui'] ? actual["ui"].yellow : ""}`);
            const pkg = process.cwd() + SEPRATOR + 'package.json';
            if (error) {
                Fx.fxError(!Io.isExist(pkg), 10017, process.cwd());
            }
            // 判断actual.name是否符合规范
            let path = actual['ui'].replace(/\./g, SEPRATOR);
            const prefix = `src${SEPRATOR}${type}`;
            // 语言文件
            const env = Io.ioProp(process.cwd() + SEPRATOR + '.env.development');
            const language = env['Z_LANGUAGE'];
            result.language = language;
            if (path.startsWith(prefix)) {
                result.pathPage = path.replace(prefix, "");
                result.pathComponent = Io.dirResolve(process.cwd()) + SEPRATOR + path;
                result.pathResource = Io.dirResolve(process.cwd() + `${SEPRATOR}src${SEPRATOR}cab${SEPRATOR}${language}`)
                    + SEPRATOR + path.replace("src" + SEPRATOR, "");
            } else {
                result.pathPage = SEPRATOR + path;
                result.pathComponent = Io.dirResolve(process.cwd()) + `${SEPRATOR}src${SEPRATOR}${type}${SEPRATOR}` + path;
                result.pathResource = Io.dirResolve(process.cwd() + `${SEPRATOR}src${SEPRATOR}cab${SEPRATOR}${language}${SEPRATOR}${type}`)
                    + SEPRATOR + path;
            }
            result.namespace = result.pathComponent.split('src')[1];
            result.pathZero = `${process.cwd()}${SEPRATOR}.zero${SEPRATOR}react${SEPRATOR}${result.pathPage.replace(reg, '.')}.${filename}.zero`;
        }
        if (result.namespace.trim().startsWith(SEPRATOR)) {
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
        log.info(`文件颜色说明：${`JavaScript`.yellow} / ${`TypeScript`.blue} / ${`Less`.blue} / ${`Json`.green}`);
        log.info(`==> UI文件：${result.fileJs.yellow} / ${result.fileJson.green}`);
        log.info(`==> Epic文件：${result.fileTypes.yellow} / ${result.fileEpic.yellow}`);
        log.info(`==> Op文件：${result.fileOp.blue}`);
        log.info(`==> Less文件：${result.fileLess.blue}`);
        log.info(`==> Cab名空间：${result.fileCab.green}`);
        // 递归创建目录
        Io.makeDirs(result.pathComponent);
        return result;
    }
;
const reactComponentRoot = (actual = {}, filename, type = "components") =>
    _reactRoot(actual, filename, true, type);
const reactResourceRoot = (actual = {}, filename, type = "components") =>
    _reactRoot(actual, filename, false, type);
const reactFileAnalyze = (files = "", config = {}) => {
    files = files.split(',');
    const finalFiles = [];
    files.forEach(file => {
        if (file.startsWith("UI")) {
            finalFiles.push(
                `${file}.js`
            );
            finalFiles.push(
                `${file}.json`
            );
        }
        if (file.startsWith("Op")) {
            finalFiles.push(
                `${file}.ts`
            );
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
            formated[file] = config.pathResource + SEPRATOR + file;
        } else {
            formated[file] = config.pathComponent + SEPRATOR + file;
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
            dirData[key] = Io.ioString(path + SEPRATOR + item);
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
            line +=
                `import ${name} from './${child.substring(0, child.lastIndexOf('.'))}';\n`
            ;
            define.push(name);
        });
        line += "export default {\n";
        define.forEach(each => {
            line +=
                `    ...${each},\n`
            ;
        })
    }
    line += "}";
    return line;
};
const reactPathResolve = (path = ".", type = "components") => {
    if ("." === path.trim()) {
        // 使用的是当前目录，直接返回
        return path;
    } else {
        if (path.startsWith(
            `src/${type}`
        )) {
            return path;
        } else {
            const count = Word.strSlashCount(path);
            Fx.fxError(1 !== count || path.startsWith("/"), 10026, path);
            return `src/${type}/` + path;
        }
    }
};
module.exports = {
    reactRoot,
    reactTpl,
    reactOp,
    reactLanguage,
    reactPathResolve,
    reactComponentRoot,
    reactFileAnalyze,
    reactResourceRoot
};