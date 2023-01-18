const __IO = require('./ai.export.interface.io');
const Ec = require("./index");

const seekResource = (path = ".") => {
    const parent = __IO.dirTree(path, folder => __IO.isExist(folder + "/pom.xml"));
    // 查找最近的项目目录资源信息
    let found;
    parent.forEach(item => {
        if (found) {
            if (item.length > found.length) {
                found = item;
            }
        } else {
            found = item;
        }
    });
    // 追加 src/main/resources/
    return `${found}/src/main/resources`;
}

const seekChildren = (path = ".", filterFn) => {
    const children = __IO.dirChildren(path, true);
    const fileArray = [];
    children.forEach(child => {
        const files = __IO.ioFiles(child);
        files.forEach(file => {
            if (__IO.isFunction(filterFn)) {
                if (filterFn(file.file)) {
                    fileArray.push(file.path.replace(path, ""));
                }
            } else {
                fileArray.push(file.path.replace(path, ""));
            }
        })
    })
    return fileArray;
}

module.exports = {
    seekResource,
    seekChildren,
}