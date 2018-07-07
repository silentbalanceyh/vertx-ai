const fs = require('fs');
const {Java, parseApi} = require('../shared');
const Ux = require('../../../epic');
const _calcPath = (config = {}, root = "") => {
    root = root + '/' + config['package'].replace(/\./g, '/');
    root = root + '/cv/';
    let name = "";
    if (config.hasOwnProperty('constant')) {
        root = root + config.constant + ".java";
        name = config.constant;
    } else {
        root = root + "Addr.java";
        name = "Addr";
    }
    return {
        package: config['package'] + '.cv',
        file: root,
        name
    };
};
const _calcAddrVar = (config = {}) => {
    const api = parseApi(config.api);
    let name = "ADDR";
    let value = "EVENT://ADDR";
    name = name + api.uri.replace(/\//g, '_').replace(/-/g, '_') + `_${api.method}`;
    value = value + api.uri.replace(/-/g, '/') + `/${api.method}`;
    name = name.toLocaleUpperCase();
    value = value.toLocaleUpperCase();
    return {
        name, value
    }
};
const goCv = (config = {}, root = "") => {
    // 最终定位的常量文件
    const meta = _calcPath(config, root);
    Ux.info(`常量文件处理：${meta.file}`.green);
    let reference = null;
    if (fs.existsSync(meta.file)) {
        // 修改
        reference = Java.loadInterface(meta.file);
    } else {
        // 重新创建
        reference = Java.createInterface(meta.package, meta.name);
    }
    // 变量处理
    const vars = _calcAddrVar(config);
    reference.addMember(vars.name, vars.value);
    Ux.outString(meta.file, reference.to());
};
module.exports = {
    goCv
};