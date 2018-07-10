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
const isExist = (path) => fs.existsSync(path);
const _outFile = (paths, content) => {
    fs.writeFile(paths, content, (res) => {
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
const ioString = (path) => isFile(path) ? fs.readFileSync(path, "utf-8") : "";
const ioStream = (path) => isFile(path) ? fs.readFileSync(path) : null;
const ioProp = (path) => {
    if (isFile(path)) {
        const content = ioString(path);
        const lines = content.split('\n');
        const result = {};
        lines.forEach(line => {
            const kv = line.split('=');
            const key = kv[0] ? kv[0].trim() : undefined;
            const value = kv[1] ? kv[1].trim() : undefined;
            if (key && value) {
                result[key] = value;
            }
        });
        return result;
    } else {
        return {};
    }
};

const makeDirs = (path = "") => {
    // TODO: Path专用
    const folderTrace = path.split('/').filter(each => '' !== each);
    const folderInfo = [];
    folderTrace.forEach((trace, index) => {
        const formated = `/${trace}`;
        const previous = folderInfo[index - 1];
        let item = null;
        if (previous) {
            item = `${previous}${formated}`;
        } else {
            item = `${formated}`;
        }
        folderInfo.push(item);
    });
    // 查找第一个存在的目录
    const lefts = folderInfo.filter(item => !isExist(item)).sort((left, right) => left.length - right.length);
    lefts.filter(item => '' !== item).forEach(left => {
        Log.info("创建目录：" + left.yellow);
        fs.mkdirSync(left);
    });
    return true;
};

module.exports = {
    cycleParent,
    cycleChildren,
    makeDirs,

    resolveDirectory,

    toJObject,
    toJArray,

    ioJArray,
    ioJObject,
    ioString,
    ioStream,
    ioProp,
    ioRoot,

    outJson,
    outString,

    isFile,
    isDirectory,
    isExist
};