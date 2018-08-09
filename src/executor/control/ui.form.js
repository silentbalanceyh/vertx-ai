const Ux = require('../../epic');
const Helper = require('./_internal');

const _parseForm = (file = "UI.Form.Add") => (actual = {}) => {
    const tpl = Ux.reactTpl(__dirname);
    const data = tpl[file];
    return data.replace(/#NAME#/g, actual.name);
};

const TPL = {
    "FORM": _parseForm(),
    "EDIT": _parseForm("UI.Form.Edit"),
    "FILTER": _parseForm("UI.Filter")
};
const jsUiForm = () => {
    const actual = Ux.executeInput(
        [],
        [
            ['-m', '--module', "FORM"],
            ['-p', '--path', "UI.Form"],
            ['-y', '--yes', false]
        ]
    );
    Helper.onOut(actual);
    Ux.fxTerminal(!Ux.isIn(actual.module, "FORM", "FILTER", "HALF", "EDIT"),
        Ux.E.fn10028(actual.module));
    const meta = Helper.onMetadata(actual['out'], actual.path);
    const overwrite = Boolean(actual['yes']);
    // 1.写Op.ts
    Helper.writeOp(meta);
    // 2.写名空间文件
    Helper.writeCab(meta, overwrite);
    // 3.资源文件
    const formData = Helper.defaultForm();
    Helper.writeResource(meta, formData, overwrite);
    // 4.写组件文件
    const parser = TPL[actual.module];
    const tpl = parser(actual);
    Helper.writeComponent(meta, tpl, overwrite);
};

module.exports = {
    jsUiForm
};