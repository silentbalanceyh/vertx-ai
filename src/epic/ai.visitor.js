const fs = require('fs');
const Immutable = require('immutable');
const U = require('underscore');
const Sure = require('./object.sure');
const E = require('./object.error');
const Fx = require('./ai.fx');
const It = require('./ai.collection');
const Io = require('./ai.io');
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
                button.key = `btn${Word.strFirstUpper(eachVals[1])}`;
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

const _parseValue = (value = "") => {
    // 是否数值
    if (value) {
        if ("true" === value.toString().toLowerCase()
            || "false" === value.toString().toLowerCase()) {
            value = "true" === value.toString().toLowerCase();
        } else if (value.startsWith("[")) {
            value = JSON.parse(value);
        } else {
            const reg = /^([1-9]\d*|-[1-9]\d*)$/;
            if (reg.test(value)) {
                value = parseInt(value, 10);
            }
        }
    }
    return value;
};
const _parseExpr = (item = "") => {
    let ret = item;
    if (item) {
        item = item.toString().trim();
        if (0 < item.indexOf('=')) {
            const kv = item.split('=');
            kv[1] = _parseValue(kv[1]);
            ret = [kv[0], kv[1]];
        } else {
            ret = [item, item];
        }
    }
    return ret;
};

const _parseRel = (lines = []) => {
    const array = [];
    lines.forEach(line => {
        const parsed = _parseExpr(line.trim());
        array.push(parsed);
    });
    return array;
};

const _parseOption = (item = "", name = "option") => {
    const root = Io.ioRoot();
    const prop = parseZero(root + "/commander/" + name + ".zero", ["P;"]);
    const kv = _parseExpr(item);
    const pair = {};
    pair[kv[0]] = kv[1];
    if (prop[kv[0]]) pair[prop[kv[0]]] = kv[1];
    delete pair[undefined];
    return pair;
};

const _parseArray = (lines = []) => {
    const fields = lines.shift();
    const fieldArr = fields.split(',');
    const result = [];
    lines.forEach(line => {
        const valueArr = line.toString().trim().split(',');
        const entity = {};
        It.itPair(fieldArr, valueArr, (first, second) => {
            first = first ? first.trim() : first;
            second = second ? second.trim() : second;
            if (first.startsWith('option')) {
                const optionValue = _parseOption(second);
                if (0 < Object.keys(optionValue).length) {
                    entity[first] = optionValue;
                }
            } else {
                entity[first] = second;
            }
        });
        result.push(entity);
    });
    return result;
};

const _parseProp = (lines) => {
    const data = {};
    lines.forEach(line => {
        const parsed = _parseExpr(line.trim());
        data[parsed[0]] = parsed[1];
    });
    return data;
};
const _parseKv = (lines = []) => {
    let content = "";
    lines.forEach(line => content += line);
    const pairs = content.split(',');
    const result = {};
    pairs.forEach(pair => {
        const input = pair.trim();
        const kv = _parseExpr(input);
        result[kv[0].trim()] = kv[1];
    });
    return result;
};

const PARSER = {
    "P;": _parseProp, "P": _parseProp,
    "A;": _parseArray, "A": _parseArray,
    "KV;": _parseKv, "KV": _parseKv,
    "UI;": parseUi, "UI": parseUi,
    "R;": _parseRel, "R": _parseRel
};
/**
 * ## `Ec.parseZero`
 *
 * ### 1. 基本介绍
 *
 * 解析路径中的特殊文件，文件后缀使用`.zero`，作为当前工具的核心配置数据，文件内容通常如下（`UTF-8`方式读取内容）：
 *
 * ```shell
 * PREFIX;
 * <Content>
 * ```
 *
 * 此处`PREFIX`则是第二参数，表示不同的文件类型，不同文件类型的解析方式有所区别。
 *
 * ### 2. 文件类型
 *
 * |前缀|含义|
 * |:---|:---|
 * |`P;`|属性文件专用集，用于描述基础属性文件内容。|
 * |`KV;`|`P;`的不换行模式，直接以`,`为每一个键值对的匹配项，去`\n`换行符过后统一解析，不支持`ENUM`枚举信息。|
 * |`R;`|关系专用解析文件，可解析关系数据文件（后期可增强）。|
 * |`A;`|命令解析专用，表格解析器，解析以`\t`为分隔符的表格，然后解析尾部`optionX`部分为配置选项。|
 * |`UI;`|Jsx文件专用解析器，根据文件模板解析数据。|
 * |`J;`|Java文件专用解析器，解析Java源代码文件数据专用。|
 *
 * @memberOf module:epic
 * @param {String} path 解析文件的路径
 * @param {Array} fileTypes 文件前缀类型
 * @returns {Any} 最终解析出来的数据内容
 */
const parseZero = (path, fileTypes = ['J;', 'P;', 'A;', 'KV;', "UI;", 'R;']) => {
    const content = fs.readFileSync(path, "utf-8").trim();
    const lines = content.split(/\n/g);
    const fileType = lines.shift();
    Sure.cxEnum(fileType, fileTypes);
    const parser = PARSER[fileType];
    Fx.fxTerminal(!U.isFunction(parser), E.fn10003(fileType));
    return parser(lines);
};
/**
 * ## `Ec.parseArgs`
 *
 * @memberOf module:epic
 * @param {Number} ensure 参数允许的长度解析，如果长度不合法，则直接退出
 * @returns {Object} 解析成功后的数据信息
 */
const parseArgs = (ensure) => {
    const inputArgs = process.argv.splice(3);
    if (ensure === inputArgs.length) {
        const config = {};
        let key = undefined;
        let value = undefined;
        for (let idx = 0; idx <= inputArgs.length; idx++) {
            if (0 === idx % 2) {
                key = inputArgs[idx];
            } else {
                value = inputArgs[idx];
            }
            if (key && value) {
                config[key] = value;
                key = undefined;
                value = undefined;
            }
        }
        return config;
    } else {
        Log.error(`参数丢失，期望参数: ${ensure / 2} 个.`);
        process.exit();
    }
};
const zeroData = (object = {}, path = "") => {
    if (!U.isArray(path)) {
        path = path.split('.');
    }
    const $data = Immutable.fromJS(object);
    let hitted = $data.getIn(path);
    if (hitted) {
        if (U.isFunction(hitted.toJS)) {
            hitted = hitted.toJS();
        } else {
            hitted = "";
        }
    }
    return hitted;
};
const ioVisit = (object = {}, path = "") => {
    let hitValue = zeroData(object, path);
    if ("object" !== typeof hitValue) {
        hitValue = {};
    }
    return hitValue;
};
const ioAttribute = (object = {}, path = "", data) => {
    let $object = Immutable.fromJS(object);
    if (data) {
        if (!U.isArray(path)) {
            path = path.split('.');
        }
        $object = $object.setIn(path, data);
    }
    return $object.toJS();
};
module.exports = {
    parseArgs,
    parseZero,
    ioVisit,
    ioAttribute,
};