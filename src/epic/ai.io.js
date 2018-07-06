const fs = require('fs');
const Root = require('app-root-path');
const Sure = require('./ai.sure');
const Log = require('./ai.log');

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
const outJson = (paths, content) => {
    if (content) {
        fs.writeFile(paths, JSON.stringify(content, null, 4), () => {
            Log.info(`成功将数据写入到文件：${paths}！`.cyan);
        });
    }
};
const ioJObject = (path) => isFile(path) ? toJObject(fs.readFileSync(path, "utf-8")) : {};
const ioJArray = (path) => isFile(path) ? toJArray(fs.readFileSync(path, "utf-8")) : [];

module.exports = {
    toJObject,
    toJArray,

    ioJArray,
    ioJObject,
    ioRoot,

    outJson,

    isFile,
    isDirectory
};