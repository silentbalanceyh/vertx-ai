const Log = require('./ai.log');
const Word = require('./ai.word');
const _parseButtons = (value) => {
    if (value.startsWith('(') && value.endsWith(')')) {
        // 分组的情况
    } else {
        value = value.split('-');
        const buttons = [];
        value.forEach((eachVal) => {
            const button = {};
            const eachVals = eachVal.split(':');
            button.text = eachVals[0];
            if (eachVals[1]) {
                button.key = `btn${Word.firstUpper(eachVals[1])}`;
            }
            if (eachVals[2]) {
                button.type = eachVals[2];
            }
            buttons.push(button);
        });
        return buttons;
    }
};
const _parseTopbar = (key, value = "") => {
    const textes = value.split(',');
    const ret = {};
    const config = {};
    textes.forEach(text => {
        if (0 <= text.indexOf('=')) {
            const kv = text.split('=');
            const key = kv[0].trim();
            let value = kv[1].trim();
            if ("buttons" === key) {
                value = _parseButtons(value);
            }
            config[key] = value;
        }
    });
    ret[`_${key}`] = config;
    return ret;
};
const _parseTabs = (key, value = "") => {
    const textes = value.split(',');
    const ret = {};
    const items = [];
    textes.forEach((each, index) => {
        const item = {};
        item.tab = each;
        item.key = `tabItem${index}`;
        items.push(item);
    });
    ret[`_${key}`] = {items};
    return ret;
};
const _parseNav = (key, value = "") => {
    const textes = value.split(',');
    const ret = {};
    const items = [];
    textes.forEach(each => {
        const item = {};
        if (0 <= each.indexOf('-')) {
            const meta = each.split('-');
            item.text = meta[0];
            item.uri = meta[1];
        } else {
            item.text = each;
        }
        items.push(item);
    });
    if (0 < items.length && items[0]) {
        items[0].uri = '$MAIN$';
    }
    if (1 < items.length && items[items.length - 1]) {
        items[items.length - 1].uri = '$SELF$';
    }
    items.forEach((item, index) => {
        item.key = `lnkNav${index}`;
    });
    ret[`_${key}`] = items;
    return ret;
};
const _parser = {
    NAV: _parseNav,
    TOPBAR: _parseTopbar,
    TABS: _parseTabs
};
const _parseLine = (line = "") => {
    // 以#号为配置项
    if (0 <= line.indexOf('#')) {
        const kv = line.split('#');
        const prefix = kv[0];
        const value = kv[1];
        const type = prefix.toUpperCase();
        if (_parser[type]) {
            return _parser[type](prefix, value);
        }
    } else {
        Log.warn(`不合法格式（不包含#）跳过配置行${line}`)
    }
    return {};
};
const parseUi = (lines = []) => {
    const result = {};
    lines.forEach(line => {
        const kv = _parseLine(line);
        Object.assign(result, kv);
    });
    return result;
};
module.exports = {
    parseUi
};