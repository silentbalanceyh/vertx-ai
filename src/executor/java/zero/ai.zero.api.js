const fs = require('fs');
const {Java, parseApi} = require('../shared');
const Ux = require('../../../epic');
const _calcAddr = (config = {}, root = "") => {
    root = root + '/' + config['package'].replace(/\./g, '/');
    root = root + '/cv/';
    let name = "";
    if (config.hasOwnProperty('constant')) {
        name = config.constant;
    } else {
        name = "Addr";
    }
    root = root + name + '.java';
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
const _calcAnnotation = (config = {}, reference) => {
    const annotations = [];
    const api = parseApi(config.api);

    annotations.push(`@Path("${api.uri}")`);
    reference.addImport(`javax.ws.rs.Path`);
    // Jsr
    annotations.push(`@${api.method.toUpperCase()}`);
    reference.addImport(`javax.ws.rs.${api.method.toUpperCase()}`);

    // Address
    let name = "ADDR" + api.uri.replace(/\//g, '_').replace(/-/g, '_') + `_${api.method}`;
    name = name.toUpperCase();
    annotations.push(`@Address(Addr.${name})`);
    reference.addImport(`io.vertx.up.annotations.Address`);

    return annotations;
};
const _calcAgentI = (config = {}, root = "") => {
    const service = config['service'];
    const ir = config['ir'];
    root = root + '/' + config['package'].replace(/\./g, '/');
    root = root + `/micro/${service}/`;
    let name = null;
    if (Boolean(ir)) {
        name = `${config.agent}IrApi`;
    } else {
        name = `${config.agent}Api`;
    }
    root = root + name + '.java';
    return {
        package: config['package'] + '.cv',
        file: root,
        name
    }
};
const goCv = (config = {}, root = "") => {
    // 最终定位的常量文件
    const meta = _calcAddr(config, root);
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
const goAgent = (config = {}, root = "") => {
    // 最终定义的文件
    const meta = _calcAgentI(config, root);
    Ux.info(`Agent文件处理：${meta.file}`.green);
    let reference = null;
    if (fs.existsSync(meta.file)) {
        // 修改
        reference = Java.loadInterface(meta.file);
    } else {
        // 重新创建
        reference = Java.createInterface(meta.package, meta.name);
    }
    if (config.method) {
        config.method = Ux.parseMethod(config.method);
    }
    const annotations = _calcAnnotation(config, reference);
    reference.addMethod(config.method, annotations);
    //console.info(reference);
    Ux.outString(meta.file, reference.to());
};
module.exports = {
    goCv,
    goAgent,
};