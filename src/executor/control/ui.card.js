const Ux = require('../../epic');
const Helper = require('./_internal');
const TYPE_MAPPING = {
    "p": "PageCard",
    "h": "HelpCard"
};

const _parseMeta = (actual = {}) => {
    const restData = {};
    restData['_page'] = {};
    let type = "p"; // p - PageCard, h - HelpCard
    Ux.fxTerminal("string" !== typeof actual.value, Ux.E.fn10025(actual.value));
    const literal = actual.value;
    let title = "";
    if (0 < literal.indexOf(":")) {
        const parsed = literal.split(':');
        title = parsed[0];
        type = parsed[1];
        restData['_page'].title = title;
    } else {
        restData['_page'].title = literal;
    }
    const filename = TYPE_MAPPING[type];
    const file = Ux.reactTpl(__dirname)[filename];
    return {data: restData, file}
};

const jsUiPageCard = () => {
    const actual = Ux.executeInput(
        ['-v', '--value'],
        [
            ['-v', '--value'],
            ['-y', '--yes', false]
        ]
    );
    Helper.onOut(actual);
    const meta = Helper.onMetadata(actual['out']);
    const overwrite = Boolean(actual['yes']);
    // 然后执行
    const content = _parseMeta(actual);
    // 1.写资源文件
    Helper.writeResource(meta, content.data, overwrite);
    // 2.写名空间文件
    Helper.writeCab(meta, overwrite);
    // 3.写组件文件
    Helper.writeComponent(meta, content.file, overwrite);
};

module.exports = {
    jsUiPageCard
};