const os = require("os");
const _V = require('./zero.__.v.constant');

const findTrace = (path = "") => {
    const folderTrace = path.split(_V.FILE_DELIMITER).filter(each => '' !== each);
    const folderInfo = [];
    folderTrace.forEach((trace, index) => {
        const formatted = `${_V.FILE_DELIMITER}${trace}`;
        const previous = folderInfo[index - 1];
        let item = null;
        if (previous) {
            item = `${previous}${formatted}`;
        } else {
            if (os.platform() === 'win32') {
                item = `${trace}`
            } else {
                item = `${formatted}`;
            }
        }
        folderInfo.push(item);
    });
    return folderInfo
};
const findMaxFields = (array = []) => {
    let keys = {};
    for (let idx = 0; idx < array.length; idx++) {
        const length = Object.keys(array[idx]).length;
        if (length > Object.keys(keys).length) {
            keys = array[idx];
        }
    }
    return Object.keys(keys);
};
module.exports = {
    findTrace,
    findMaxFields,
}