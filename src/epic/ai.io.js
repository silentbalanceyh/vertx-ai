const fs = require('fs');
const Root = require('app-root-path');
const Sure = require('./ai.sure');
const Log = require('./ai.log');
const Fx = require('./ai.fx');

const toJObject = (content = "") => {
    Sure.cxJString(content);
    return JSON.parse(content);
};
const toJArray = (content = "") => {
    Sure.cxJString(content);
    return JSON.parse(content);
};

const ioRoot = () => Root;
const isFile = (path) => fs.statSync(path).isFile();
const isDirectory = (path) => fs.statSync(path).isDirectory();
const _outFile = (paths, content) => {
    fs.writeFile(paths, content, () => {
        Log.info(`成功将数据写入到文件：${paths}！`.cyan);
    });
};
const outJson = (paths, content) => Fx.fxContinue(!!content, () => _outFile(paths, JSON.stringify(content, null, 4)));
const outString = (paths, content) => Fx.fxContinue(!!content, () => _outFile(paths, content));
const resolveDirectory = (path = "") => {
    let result = path.trim();
    if (result.endsWith('/')) {
        result = result.substring(0, result.length - 1);
    }
    return result;
};
const cycleParent = (path, includeCurrent = false) => {
    let result = [];
    if (includeCurrent) {
        result.push(path);
    }
    Fx.fxContinue(fs.existsSync(path), () => {
        let parent = resolveDirectory(path);
        parent = parent.substring(0, parent.lastIndexOf('/'));
        result.push(parent);
        result = result.concat(cycleParent(parent, false));
    });
    return result;
};
const cycleChildren = (path, includeCurrent = true) => {
    let result = [];
    if (includeCurrent) {
        result.push(path);
    }
    Fx.fxContinue(fs.existsSync(path), () => {
        const folders = fs.readdirSync(path);
        const directory = resolveDirectory(path) + '/';
        folders.forEach(item => Fx.fxContinue(!item.startsWith('.'), () => {
            const absolute = directory + item;
            if (isDirectory(absolute)) {
                result.push(absolute);
                result = result.concat(cycleChildren(absolute, false));
            }
        }));
    });
    return result;
};
const ioJObject = (path) => isFile(path) ? toJObject(fs.readFileSync(path, "utf-8")) : {};
const ioJArray = (path) => isFile(path) ? toJArray(fs.readFileSync(path, "utf-8")) : [];

module.exports = {
    cycleParent,
    cycleChildren,

    resolveDirectory,

    toJObject,
    toJArray,

    ioJArray,
    ioJObject,
    ioRoot,

    outJson,
    outString,

    isFile,
    isDirectory
};