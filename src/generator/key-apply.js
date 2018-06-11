const ai = require('../zero/zero');
const {args, log, config} = ai;
const fs = require("fs");
const uuid = require("uuid");

const applyKey = (data = {}) => {
    for (const key in data) {
        const value = data[key];
        if ("object" === typeof value) {
            if (Array.prototype.isPrototypeOf(value)) {
                value.forEach(item => applyKey(item));
            } else {
                applyKey(value);
            }
        }
    }
    if (!data.key) data.key = uuid();
};

exports.applyKey = function () {
    const argv = args.parseArgs(2);
    const inputFile = argv['-d'] || argv['--data'];
    config.execFileExist(inputFile, (configPath) => {
        const configData = JSON.parse(fs.readFileSync(configPath));
        applyKey(configData.data);
        log.info(`写入数据到${inputFile}`);
        fs.writeFileSync(inputFile, JSON.stringify(configData, null, 4), "utf-8");
    })
};