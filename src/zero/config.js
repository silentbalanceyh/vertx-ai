const fs = require('fs');
const log = require('./log');
const execFileExist = (configFile, callback) => {
    if (fs.existsSync(configFile)) {
        log.info(`从配置文件初始化，配置文件路径: ${configFile}.`);
        callback(configFile);
    } else {
        log.error(`配置文件路径不存在: ${configFile}`);
    }
};
module.exports = {
    execFileExist
};