const fs = require("fs");
const U = require("underscore");

const __CX = require('./ai.under.fn.cx.evaluate');
const __FX = require('./ai.under.fn.fx.terminal');
const __IO = require('./ai.path.fn.io.typed');
const __V = require('./zero.__.v.constant');
const __U = require('./zero.__.fn.find.util');
const ioName = (path = '.') => {
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
        return path.substring(path.lastIndexOf(__V.FILE_DELIMITER) + 1);
    }
};

const ioRoot = () => {
    const folderInfo = __U.findTrace(__dirname);
    let root = folderInfo.filter(item => item.endsWith("src"));
    __FX.fxError(1 !== root.length, 10022, __dirname);
    return root[0];
};


const ioDataA = (path) => {
    // 先读取数据信息
    __CX.cxExist(path);
    const content = __IO.ioString(path);
    try {
        const parsed = JSON.parse(content);
        if (U.isArray(parsed)) {
            return parsed;
        } else {
            if (parsed.data && U.isArray(parsed.data)) {
                return parsed.data;
            } else {
                return [];
            }
        }
    } catch (error) {
        return [];
    }
}
module.exports = {
    ioName,
    ioRoot,
    ioDataA,
}