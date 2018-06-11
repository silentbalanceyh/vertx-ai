const ai = require('../zero/zero');
const {args, log, config} = ai;
const fs = require("fs");
const uuid = require("uuid");

exports.applyKey = function () {
    const argv = args.parseArgs(2);
    const inputFile = argv['-d'] || argv['--data'];
    config.execFileExist(inputFile, (configPath) => {
        const configData = JSON.parse(fs.readFileSync(configPath));
        if (configData.data) {
            if (Array.prototype.isPrototypeOf(configData.data)) {
                configData.data.forEach(item => !item.hasOwnProperty('key') ? item.key = uuid() : item.key);
            } else {
                configData.data.key = !configData.data.key ? uuid() : configData.data.key;
            }
        }
        log.info(`写入数据到${inputFile}`);
        fs.writeFileSync(inputFile, JSON.stringify(configData, null, 4), "utf-8");
    })
};