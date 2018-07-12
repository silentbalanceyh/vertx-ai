const fs = require('fs');
const Immutable = require('immutable');
const U = require('underscore');
const Sure = require('./ai.sure');
const E = require('./ai.error');
const Fx = require('./ai.fx');
const It = require('./ai.collection');
const Io = require('./ai.io');
const Ui = require('./ai.visitor.ui');

const _parseValue = (value = "") => {
    // 是否数值
    if (value) {
        if ("true" === value.toString().toLowerCase()
            || "false" === value.toString().toLowerCase()) {
            value = Boolean(value);
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
const _parseProp = (lines) => {
    const data = {};
    lines.forEach(line => {
        const parsed = _parseExpr(line.trim());
        data[parsed[0]] = parsed[1];
    });
    return data;
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
    const prop = zeroParse(root.resolve("/src/datum/" + name + ".zero"), ["P;"]);
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
    "UI;": Ui.parseUi, "UI": Ui.parseUi,
    "R;": _parseRel, "R": _parseRel
};
const zeroParse = (path, fileTypes = ['J;', 'P;', 'A;', 'KV;', "UI;", 'R;']) => {
    const content = fs.readFileSync(path, "utf-8").trim();
    const lines = content.split(/\n/g);
    const fileType = lines.shift();
    Sure.cxEnum(fileType, fileTypes);
    const parser = PARSER[fileType];
    Fx.fxTerminal(!U.isFunction(parser), E.fn10003(fileType));
    return parser(lines);
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
const visitJObject = (object = {}, path = "") => {
    let hitValue = zeroData(object, path);
    if ("object" !== typeof hitValue) {
        hitValue = {};
    }
    return hitValue;
};
const writeJObject = (object = {}, path = "", data) => {
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
    zeroParse,
    visitJObject,
    writeJObject
};