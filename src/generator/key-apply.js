const ai = require('../zero/zero');
const {args, log, config} = ai;
const fs = require("fs");
const uuid = require("uuid");

const applyKey = (data = {}, field = 'key') => {
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            if ("object" === typeof value) {
                if (Array.prototype.isPrototypeOf(value)) {
                    value.forEach(item => applyKey(item, field));
                } else {
                    applyKey(value, field);
                }
            }
        }
    }
    if (!data.hasOwnProperty('$REF$')) {
        if (!data[field]) data[field] = uuid();
    }
};

const eachFile = (path, callback) => {
    const etat = fs.statSync(path);
    if (etat.isDirectory()) {
        const dir = fs.readdirSync(path);
        for (let idx = 0; idx < dir.length; idx++) {
            if (!dir[idx].startsWith("_")) {
                let hitFile = null;
                if (path.endsWith('/')) {
                    hitFile = path + dir[idx];
                } else {
                    hitFile = path + '/' + dir[idx];
                }
                eachFile(hitFile, callback);
            }
        }
    } else {
        callback(path);
    }
};

exports.applyKey = function () {
    const argv = args.parseArgs(4);
    const inputFile = argv['-d'] || argv['--data'];
    const inputField = argv['-f'] || argv['--field'];
    config.execFileExist(inputFile, (configPath) => eachFile(configPath, (file) => {
        const configData = JSON.parse(fs.readFileSync(file));
        applyKey(configData.data, inputField);
        log.info(`写入数据到${file}`);
        fs.writeFileSync(file, JSON.stringify(configData, null, 4), "utf-8");
    }))
};