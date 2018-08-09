const Ux = require('../../epic');
const Helper = require('./_internal');
const _verifyMeta = () => {
    const actual = Ux.executeInput(
        ['-v', '--value'],
        [
            ['-v', '--value'],
            ['-p', '--path', "UI"]
        ]
    );
    Helper.onOut(actual);
    const meta = Helper.onMetadata(actual['out'], actual.path);
    return {meta, actual}
};
const _executePage = (metadata = {}, callback) => {
    const {meta} = metadata;
    const json = Ux.ioJObject(meta.pathResource + "/" + meta.fileJson);
    Ux.fxTerminal(json && !json.hasOwnProperty("_page"), Ux.E.fn10030(json['_page'], '_page'));
    callback(json, metadata);
};
const _executeModal = (metadata = {}, callback) => {
    const {meta} = metadata;
    const json = Ux.ioJObject(meta.pathResource + "/" + meta.fileJson);
    callback(json, metadata);
};
const _isEditItem = (key, item) => {
    if ("string" === typeof item) {
        const keys = item.split(',');
        const current = keys[0];
        return key === current;
    } else {
        return key === item.key;
    }
};
const _isEdit = (key, array = []) => {
    const processed = array.filter(item => _isEditItem(key, item));
    return 0 < processed.length;
};
const _injectValue = (value = "") => {
    const processed = [];
    const source = value.split(',');
    source.forEach((key, index) => {
        if (2 === index) {
            processed.push(`$op${source[0].replace("btn", "")}`);
        }
        processed.push(key);
    });
    if (2 >= source.length) {
        processed.push(`$op${source[0].replace("btn", "")}`);
    }
    return processed.join(',');
};
const _executeButton = (item = {}, key = "", value = "") => {
    if (key && value) {
        Ux.fxTerminal(!value.trim().startsWith("btn"), Ux.E.fn10031(value));
        if (!item[key]) item[key] = [];
        const keys = value.split(',');
        const id = keys[0];
        if (_isEdit(id, item[key])) {
            Ux.info(`( Update ) 更新key = ${id}的按钮条目为：${value.blue}`);
            item[key].forEach((each, index) => {
                const isEdit = _isEditItem(id, each);
                if (isEdit) {
                    item[key][index] = _injectValue(value);
                }
            })
        } else {
            Ux.info(`( Add ) 添加key = ${id}的按钮条目为：${value.green}`);
            item[key].push(_injectValue(value))
        }
        return item;
    } else {
        Ux.warn("( Skip ) key或value有问题，跳过执行。");
        return item;
    }
};
const rsLeft = () => _executePage(_verifyMeta(), (json, meta) => {
    const {value} = meta.actual;
    json['_page'] = _executeButton(json['_page'], "left", value);
    // 写资源文件
    Helper.writeResource(meta.meta, json, true);
});
const rsRight = () => _executePage(_verifyMeta(), (json, meta) => {
    const {value} = meta.actual;
    json['_page'] = _executeButton(json['_page'], "right", value);
    // 写资源文件
    Helper.writeResource(meta.meta, json, true);
});
const _initData = (json = {}, key, value) => {
    if (!json.hasOwnProperty("_modal")) json['_modal'] = {};
    if (!json['_modal'].hasOwnProperty(key)) json['_modal'][key] = {};
    const kv = value.split('=');
    if (2 === kv.length) {
        json['_modal'][key][kv[0]] = kv[1];
        Ux.info(`设置 ` + `_modal -> ${key} -> ${kv[0]}`.cyan + ` = "${kv[1].green}"`);
    } else {
        Ux.warn("格式不合法，必须是key=value的格式".red);
    }
};
const rsSuccess = () => _executeModal(_verifyMeta(), (json, meta) => {
    _initData(json, "success", meta.actual.value);
    Helper.writeResource(meta.meta, json, true);
});
const rsError = () => _executeModal(_verifyMeta(), (json, meta) => {
    _initData(json, "error", meta.actual.value);
    Helper.writeResource(meta.meta, json, true);
});
const rsConfirm = () => _executeModal(_verifyMeta(), (json, meta) => {
    _initData(json, "confirm", meta.actual.value);
    Helper.writeResource(meta.meta, json, true);
});
module.exports = {
    rsLeft,
    rsRight,
    rsConfirm,
    rsSuccess,
    rsError
};