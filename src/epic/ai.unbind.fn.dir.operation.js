const __FX = require("./ai.under.fn.fx.terminal");
const fs = require("fs");
const path = require("path");
const __LOG = require("./ai.unified.fn._.logging");
const __V = require("./zero.__.v.constant");
const __U = require("./zero.__.fn.find.util");
const __IS = require("./ai.unified.fn.is.decision");
const dirResolve = (path = "") => {
    let result = path.trim();
    if (result.endsWith(__V.FILE_DELIMITER)) {
        result = result.substring(0, result.length - 1);
    }
    return result;
};
const dirParentPom = (pathDir = ".") => {
    const pathes = path.resolve(__dirname, pathDir);
    console.log(pathes + "Hello");
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
            if (isDirectory(absolute)) {
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
    dirParentPom,
}