const __FX = require("./ai.under.fn.fx.terminal");
const fs = require("fs");
const path = require("path");
const U = require("underscore");
const __LOG = require("./ai.unified.fn._.logging");
const __V = require("./zero.__.v.constant");
const __U = require("./zero.__.fn.find.util");
const __IS = require("./ai.unified.fn.is.decision");
const __IO = require("./ai.path.fn.io.specification");
const dirResolve = (path = "") => {
    let result = path.trim();
    if (result.endsWith(__V.FILE_DELIMITER)) {
        result = result.substring(0, result.length - 1);
    }
    return result;
};
const dirTree = (pathDir = ".", pathFilterFn) => {
    // 截取当前运行目录
    const pathStart = __IO.ioSwitch(pathDir);
    // 往上查找项目根目录
    const pathArr = pathStart.split(__V.FILE_DELIMITER);
    const pathIt = [];
    while (0 < pathArr.length) {
        const folder = pathArr.join("/");
        if ('' !== folder) {
            if (U.isFunction(pathFilterFn)) {
                if (pathFilterFn(folder)) {
                    pathIt.push(folder);
                }
            } else {
                pathIt.push(folder);
            }
        }
        pathArr.pop();
    }
    return pathIt;
}
const dirParent = (path, includeCurrent = false) => {
    let result = [];
    if (includeCurrent) {
        result.push(path);
    }
    __FX.fxContinue(fs.existsSync(path), () => {
        let parent = dirResolve(path);
        parent = parent.substring(0, parent.lastIndexOf(__V.FILE_DELIMITER));
        result.push(parent);
        result = result.concat(dirParent(parent, false));
    });
    return result;
};

const dirChildren = (path, includeCurrent = true) => {
    let result = [];
    if (includeCurrent) {
        result.push(path);
    }
    __FX.fxContinue(fs.existsSync(path), () => {
        const folders = fs.readdirSync(path);
        const directory = dirResolve(path) + __V.FILE_DELIMITER;
        folders.forEach(item => __FX.fxContinue(!item.startsWith('.'), () => {
            const absolute = directory + item;
            if (__IS.isDirectory(absolute)) {
                result.push(absolute);
                result = result.concat(dirChildren(absolute, false));
            }
        }));
    });
    return result;
};

const dirCreate = (path = "") => {
    // TODO: Path专用
    const folderInfo = __U.findTrace(path);
    // 查找第一个存在的目录
    const lefts = folderInfo.filter(item => !__IS.isExist(item)).sort((left, right) => left.length - right.length);
    lefts.filter(item => '' !== item).forEach(left => {
        __LOG.info("创建目录：" + left.yellow);
        fs.mkdirSync(left);
    });
    return true;
};
module.exports = {
    dirCreate,
    dirChildren,
    dirParent,
    dirResolve,
    dirTree,
}