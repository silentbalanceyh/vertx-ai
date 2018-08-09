const Ux = require('../../epic');
const TYPE_MAPPING = {
    "p": "PageCard",
    "h": "HelpCard"
};
const _parseTpl = (type = "") => {
    const tplData = Ux.reactTpl(__dirname);
    const key = TYPE_MAPPING[type];
    return tplData[key];
};
const _parseMeta = (actual = {}) => {
    const restData = {};
    restData['_page'] = {};
    let type = "p"; // p - PageCard, h - HelpCard
    Ux.fxTerminal("string" !== typeof actual.data, Ux.E.fn10025(actual.data));
    const literal = actual.data;
    let title = "";
    if (0 < literal.indexOf(":")) {
        const parsed = literal.split(':');
        title = parsed[0];
        type = parsed[1];
        restData['_page'].title = title;
    } else {
        restData['_page'].title = actual.data;
    }
    const file = _parseTpl(type);
    return {data: restData, file}
};

const _readyPath = (path, override = false) => {
    if (override) {
        return true;
    } else {
        return !Ux.isExist(path);
    }
};

const jsUiPageCard = () => {
    const actual = Ux.executeInput(
        ['-d', '--data'],
        [
            ['-o', '--out', '.'],
            ['-d', '--data'],
            ['-y', '--yes', false]
        ]
    );
    const ui = Ux.reactPathResolve(actual['out']);
    const meta = Ux.reactComponentRoot({ui}, "UI");
    // 创建目录
    Ux.fxContinue(!Ux.isExist(meta.pathComponent), Ux.makeDirs(meta.pathComponent));
    Ux.fxContinue(!Ux.isExist(meta.pathResource), Ux.makeDirs(meta.pathResource));
    // 然后执行
    const metadata = _parseMeta(actual);
    // 写资源文件
    const restPath = meta.pathResource + '/' + meta.fileJson;
    if (_readyPath(restPath, actual['yes'])) {
        Ux.outJson(restPath, metadata.data);
    } else {
        Ux.info("( Skip ) ".red + `资源文件已存在：${restPath}`.cyan);
    }
    // 写名空间文件
    const namespace = {};
    namespace.ns = meta.namespace;
    const nsPath = meta.pathComponent + "/" + meta.fileCab;
    if (_readyPath(nsPath, actual['yes'])) {
        Ux.outJson(nsPath, namespace);
    } else {
        Ux.info("( Skip ) ".red + `名空间文件已存在：${nsPath}`.cyan);
    }
    // 写组件文件
    const uiPath = meta.pathComponent + "/UI.js";
    if (_readyPath(uiPath, actual['yes'])) {
        Ux.outString(uiPath, metadata.file);
    } else {
        Ux.info("( Skip ) ".red + `组件文件已存在：${uiPath}`.cyan);
    }
};

module.exports = {
    jsUiPageCard
};