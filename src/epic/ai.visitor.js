const fs = require('fs');
const U = require('underscore');
const Sure = require('./ai.sure');
const E = require('./ai.error');
const Fx = require('./ai.fx');
const It = require('./ai.collection');
const Io = require('./ai.io');
const _parseExpr = (item = "") => {
    let ret = item;
    if (item) {
        item = item.toString().trim();
        if (0 < item.indexOf('=')) {
            const kv = item.split('=');
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
        const parsed = _parseExpr(line);
        data[parsed[0]] = parsed[1];
    });
    return data;
};

const _parseOption = (item = "", name = "option") => {
    const prop = zeroParse(Io.ioRoot() + "/src/datum/" + name + ".zero", ["P;"]);
    const kv = _parseExpr(item);
    const pair = {};
    pair[kv[0]] = kv[1];
    if (prop[kv[0]]) pair[prop[kv[0]]] = kv[1];
    return pair;
};

const _parseArray = (lines = []) => {
    const fields = lines.shift();
    const fieldArr = fields.split(',');
    const result = [];
    lines.forEach(line => {
        const valueArr = line.toString().split(',');
        const entity = {};
        It.itPair(fieldArr, valueArr, (first, second) => {
            if (first.startsWith('option')) {
                entity[first] = _parseOption(second);
            } else {
                entity[first] = second;
            }
        });
        result.push(entity);
    });
    return result;
};

const PARSER = {
    "P;": _parseProp, "P": _parseProp,
    "A;": _parseArray, "A": _parseArray
};
const zeroParse = (path, fileTypes = ['J;', 'P;', 'A;']) => {
    const content = fs.readFileSync(path, "utf-8").trim();
    const lines = content.split(/\n/g);
    const fileType = lines.shift();
    Sure.cxEnum(fileType, fileTypes);
    const parser = PARSER[fileType];
    Fx.fxTerminal(!U.isFunction(parser), E.fn10003(fileType));
    return parser(lines);
};
module.exports = {
    zeroParse
};