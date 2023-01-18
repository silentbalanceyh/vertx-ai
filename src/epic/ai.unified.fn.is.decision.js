const fs = require('fs');
const U = require("underscore");
const isFile = (path) => {
    if (fs.existsSync(path)) {
        return fs.statSync(path).isFile();
    }
};
const isDirectory = (path) => {
    if (fs.existsSync(path)) {
        return fs.statSync(path).isDirectory();
    }
};
const isExist = (path) => fs.existsSync(path);

module.exports = {
    isExist,
    isFile,
    isDirectory,
    isFunction: (input) => U.isFunction(input),
}