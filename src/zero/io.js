const fs = require('fs');
const mkdirs = (dirpath) => {
    const pathes = dirpath.split("/");
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
    for (let idx = 0; idx < targetPath.length; idx++) {
        const folder = targetPath[idx];
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, "0777");
        }
    }
    // 读取targetPath中的最后一个路径，生成namespace
    const ns = targetPath[targetPath.length - 1];
    const nsData = {};
    nsData['ns'] = ns.replace(/src\//g, "");
    const targetNs = ns + "/Cab.json";
    if (!fs.existsSync(targetNs)) {
        fs.writeFileSync(targetNs, JSON.stringify(nsData));
    }
};
module.exports = {
    mkdirs
};