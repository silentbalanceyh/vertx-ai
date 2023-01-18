const fs = require('fs');

// Import
const __TO = require("./ai.uncork.fn.to.typed");
const __IS = require('./ai.unified.fn.is.decision');
const __V = require('./zero.__.v.constant');
const __ELE = require("./ai.uncork.fn.element.feature");

const ioJObject = (path) => __IS.isFile(path) ? __TO.toJObject(fs.readFileSync(path, "utf-8")) : {};
const ioJArray = (path) => __IS.isFile(path) ? __TO.toJArray(fs.readFileSync(path, "utf-8")) : [];
const ioString = (path) => __IS.isFile(path) ? fs.readFileSync(path, "utf-8") : "";
const ioStream = (path) => __IS.isFile(path) ? fs.readFileSync(path) : null;
const ioProp = (path) => {
    if (__IS.isFile(path)) {
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
const ioFiles = (folder) => {
    const fileArr = [];
    if (__IS.isDirectory(folder)) {
        const files = fs.readdirSync(folder);
        files.forEach(item => {
            const file = item;
            const path = `${folder}${__V.FILE_DELIMITER}${item}`;
            fileArr.push({file, path})
        });
    }
    return fileArr;
};
const ioCsv = (file, separator) => {
    const data = ioString(file).split('\n');
    const header = data.shift();
    const lines = [];
    data.forEach(line => {
        if (line && 0 < line.trim().length) {
            const item = __ELE.elementZip(header.split(separator), line.split(separator), true);
            lines.push(item);
        }
    });
    return lines;
};
module.exports = {
    ioJArray,
    ioJObject,
    ioString,
    ioStream,
    ioProp,
    ioFiles,
    ioCsv,
}