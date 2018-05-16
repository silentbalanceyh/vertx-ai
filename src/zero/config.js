const fs = require('fs');
const {v4} = require("uuid");
const randomjs = require('random-js');
const Field = require("../generator/model/field");
const log = require('./log');
const execFileExist = (configFile, callback) => {
    if (fs.existsSync(configFile)) {
        log.info(`从配置文件初始化，配置文件路径: ${configFile}.`);
        callback(configFile);
    } else {
        log.error(`配置文件路径不存在: ${configFile}`);
    }
};
const eachField = (module = {}, callback) => {
    if (module['fields']) {
        module['fields'].forEach((field, index) => {
            try {
                const obj = new Field(field);
                if (callback) callback(obj, index === module['fields'].length - 1);
            } catch (error) {
                log.error(`${module.code} -> 字段表达式无法解析！`);
                console.error(error);
                process.exit();
            }
        });
    } else {
        log.error(`${module.code} -> 配置数据有问题，没有\`fields\`节点！`);
        process.exit();
    }
};
const execData = (module) => {
    const record = {};
    record.key = v4();
    if (module.data) {
        const engine = randomjs.engines.mt19937().autoSeed();
        const flag = randomjs.string()(engine, 2);
        for (const key in module.data) {
            if (module.data.hasOwnProperty(key)) {
                record[key] = module.data[key] + flag;
            }
        }
    }
    // 特殊内容处理
    record.createTime = new Date().toISOString().split('.')[0];
    record.updateTime = new Date().toISOString().split('.')[0];
    record.active = true;
    return record;
};
module.exports = {
    execFileExist,
    execData,
    eachField
};