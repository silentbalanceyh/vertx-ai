const fs = require('fs');
const Kit = require('../shared');
const {Java, parseApi} = Kit;
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
const _calcJava = (config = {}, root = "", name = "", prefix) => {
    const service = config['service'];
    root = root + '/' + config['package'].replace(/\./g, '/');
    root = root + `/micro/${service}/`;
    root = root + name + '.java';
    return {
        package: config['package'] + '.' + (
            prefix ? prefix : `micro.${service}`
        ),
        file: root,
        name
    }
};
const _calcAgentI = (config = {}, root = "") => {
    const ir = config['ir'];
    let name = "";
    if (Boolean(ir)) {
        name = `${config.model}IrApi`;
    } else {
        name = `${config.model}Api`;
    }
    return _calcJava(config, root, name);
};
const goCv = (config = {}, root = "") => {
    // 最终定位的常量文件
    const meta = _calcAddr(config, root);
    Ux.info(`Addr常量文件处理：${meta.file}`.gray);
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
    Ux.info(`Agent文件处理：${meta.file}`.gray);
    let reference = null;
    if (fs.existsSync(meta.file)) {
        // 修改
        reference = Java.loadInterface(meta.file);
    } else {
        // 重新创建
        reference = Java.createInterface(meta.package, meta.name);
        const defines = [];
        Kit.atEndPoint(defines, reference);
        Kit.atPath(defines, reference, '/');
        reference.appendAnnotation(defines);
    }
    const annotations = [];
    const api = parseApi(config.api);
    Kit.atPath(annotations, reference, api.uri);
    Kit.atMethod(annotations, reference, api.method);
    Kit.atAddress(annotations, reference, api, {
        addr: config.constant,
        pkg: config.package
    });
    reference.addAbstractMethod(config.method, annotations);
    //console.info(reference);
    Ux.outString(meta.file, reference.to());
};
const goWorker = (config = {}, root = "") => {
    const meta = _calcJava(config, root, `${config.model}Worker`);
    Ux.info(`Worker文件处理：${meta.file}`.gray);
    let reference = null;
    if (fs.existsSync(meta.file)) {
        // 修改
        reference = Java.loadClass(meta.file);
    } else {
        // 重新创建
        reference = Java.createClass(meta.package, meta.name);
        const defines = [];
        Kit.atQueue(defines, reference);
        reference.appendAnnotation(defines);
    }
    const annotations = [];
    const api = parseApi(config.api);
    Kit.atAddress(annotations, reference, api, {
        addr: config.constant,
        pkg: config.package
    });
    if (config.method) {
        // 特殊方法定制
        config.method.scope = 'public';
        config.method.returnValue = 'Future<JsonObject>';
        config.method.params = [];
        config.method.params.push({
            type: 'final Envelop',
            name: 'envelop'
        });
        config.method.ws = false;
        // 导入必要的库
        reference.addImport('io.vertx.core.Future');
        reference.addImport('io.vertx.core.json.JsonObject');
        reference.addImport('io.vertx.up.atom.Envelop');
    }
    reference.addMethod(config.method, annotations);
    Ux.outString(meta.file, reference.to());
};
module.exports = {
    goCv,
    goAgent,
    goWorker,
};