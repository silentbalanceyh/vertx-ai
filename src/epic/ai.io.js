const fs = require('fs');
const Sure = require('./ai.sure');

const toJObject = (content = "") => {
    Sure.cxJString(content);
    return JSON.parse(content);
};
const toJArray = (content = "") => {
    Sure.cxJString(content);
    return JSON.parse(content);
};

const isFile = (path) => fs.statSync(path).isFile();
const isDirectory = (path) => fs.statSync(path).isDirectory();

const ioJObject = (path) => isFile(path) ? toJObject(fs.readFileSync(path, "utf-8")) : {};
const ioJArray = (path) => isFile(path) ? toJArray(fs.readFileSync(path, "utf-8")) : [];

module.exports = {
    toJObject,
    toJArray,

    ioJArray,
    ioJObject,

    isFile,
    isDirectory
};