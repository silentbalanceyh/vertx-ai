const Ux = require('../../../epic');
const path = require('path');
const SEP = path.sep;
const _verifyPath = (path) => {
    Ux.fxTerminal(!path, Ux.E.fn10027(path));
    const counter = Ux.countSlash(path);
    Ux.fxTerminal(1 !== counter, Ux.E.fn10027(path));
    Ux.fxTerminal(path.startsWith("src" + SEP + "components"), Ux.E.fn10027(path));
    return path;
};
const _readyPath = (path, override = false) => {
    if (override) {
        return true;
    } else {
        return !Ux.isExist(path);
    }
};
const onMetadata = (out, name = "UI") => {
    const path = _verifyPath(out);
    const ui = Ux.reactPathResolve(path);
    const meta = Ux.reactComponentRoot({ui}, name);
    // 创建目录
    Ux.fxContinue(!Ux.isExist(meta.pathComponent), Ux.makeDirs(meta.pathComponent));
    Ux.fxContinue(!Ux.isExist(meta.pathResource), Ux.makeDirs(meta.pathResource));
    return meta;
};
const writeResource = (meta = {}, content, overwrite = false) => {
    // 写资源文件
    const restPath = meta.pathResource + SEP + meta.fileJson;
    if (_readyPath(restPath, overwrite)) {
        Ux.outJson(restPath, content);
    } else {
        Ux.info("( Skip ) ".red + `资源文件已存在：${restPath}`.cyan);
    }
};
const writeCab = (meta = {}, overwrite = false) => {
    // 写名空间文件
    const namespace = {};
    namespace.ns = meta.namespace;
    const nsPath = meta.pathComponent + SEP + meta.fileCab;
    if (_readyPath(nsPath, overwrite)) {
        Ux.outJson(nsPath, namespace);
    } else {
        Ux.info("( Skip ) ".red + `名空间文件已存在：${nsPath}`.cyan);
    }
};
const writeComponent = (meta = {}, content, overwrite = false) => {
    // 写组件文件
    const uiPath = meta.pathComponent + SEP + meta.fileJs;
    if (_readyPath(uiPath, overwrite)) {
        Ux.outString(uiPath, content);
    } else {
        Ux.info("( Skip ) ".red + `组件文件已存在：${uiPath}`.cyan);
    }
};
const writeOp = (meta = {}) => {
    const opPath = meta.pathComponent + SEP + meta.fileOp;
    if (_readyPath(opPath)) {
        Ux.outString(opPath, "export default {}");
    } else {
        Ux.info("( Skip ) ".red + `Op文件已存在：${opPath}`.cyan);
    }
};
module.exports = {
    onMetadata,
    writeResource,
    writeCab,
    writeComponent,
    writeOp
};