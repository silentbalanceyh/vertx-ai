const Ux = require('../epic');
const U = require('underscore');
const uuid = require('uuid');
const _applyUUID = (data = {}, field) => {
    if (!data.hasOwnProperty('$REF$') &&
        !U.isArray(data) &&
        !data[field]) {
        data[field] = uuid();
    }
};
const _applySeq = (data = {}, index = 0) => {
    Ux.itObject(data, (key, value) => {
        if ("$SEQ$" === value) {
            data[key] = (index + 1);
        } else if ("$IDX$" === value) {
            data[key] = index;
        }
    })
};
const _applyEach = (data = {}, field = 'key') => {
    if (U.isArray(data)) {
        data.forEach(element => {
            if ("object" === typeof element) {
                _applyEach(element, field);
            }
        })
    } else {
        _applyUUID(data, field);
        Ux.itObject(data, (key, value) => {
            if ("object" === typeof value) {
                _applyEach(value, field);
            }
        })
    }
};
const executeKey = () => {
    const actual = Ux.executeInput(
        ['-d', '--data'],
        [
            ['-d', '--data'],
            ['-f', '--field', 'key'],
            ['-p', '--path', 'data']
        ]
    );
    Ux.cxExist(actual.data);
    Ux.itFileSync(actual.data, (item) => {
        const config = Ux.ioJObject(item);
        const body = Ux.visitJObject(config, actual.path);
        _applyEach(body, actual.field);
        const content = Ux.writeJObject(config, actual.path, body);
        Ux.outJson(actual.data, content);
    });
};

const executeDefault = () => {
    const actual = Ux.executeInput(
        [
            ['-c', '--config'],
            ['-o', '--out']
        ],
        [
            ['-o', '--out'],
            ['-c', '--config']
        ]
    );
    let configFile = actual.config.endsWith(".zero")
        ? actual.config : actual.config + ".zero";
    configFile = `.zero/default/${configFile}`;
    Ux.cxExist(configFile);
    Ux.cxExist(actual['out']);
    // 读取配置文件
    const applied = Ux.zeroParse(configFile);
    if ("object" === typeof applied) {
        Ux.info(`追加数据：\n${JSON.stringify(applied, null, 4).yellow}`);
        // 读取文件
        const data = Ux.ioJObject(actual['out']);
        if (data && data.data) {
            data.data.forEach(item => Object.assign(item, applied));
            // 单独处理$SEQ$节点
            data.data.forEach(_applySeq);
            Ux.outJson(actual['out'], data);
        }
    }
};
module.exports = {
    executeKey,
    executeDefault
};