const fs = require('fs');
const dirTree = (pathes = []) => {
    const targetPath = [];
    let item;
    for (let idx = 0; idx < pathes.length; idx++) {
        if (item) {
            item = item + "/" + pathes[idx];
        } else {
            item = pathes[idx];
        }
        targetPath.push(item);
    }
    return targetPath;
};
const dirsMake = (dirpath) => {
    const pathes = dirpath.split("/");
    const targetPath = dirTree(pathes);
    for (let idx = 0; idx < targetPath.length; idx++) {
        const folder = targetPath[idx];
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, "0777");
        }
    }
};
module.exports = {
    dirsMake,
    dirTree
};