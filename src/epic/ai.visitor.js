const fs = require('fs');
const U = require('underscore');
const Sure = require('./ai.sure');
const E = require('./ai.error');
const Fx = require('./ai.fx');
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

const _parseArray = (lines = []) => {
    const fields = lines.shift();
    const values = lines;
};

const PARSER = {
    "P;": _parseProp, "P": _parseProp,
    "A;": _parseArray, "A": _parseArray
};
const zeroParse = (path) => {
    const content = fs.readFileSync(path, "utf-8").trim();
    const lines = content.split(/\n/g);
    const fileType = lines.shift();
    Sure.cxEnum(fileType, ['J;', 'P;', 'A;']);
    const parser = PARSER[fileType];
    Fx.fxTerminal(!U.isFunction(parser), E.fn10003(fileType));
    return parser(lines);
};
module.exports = {
    zeroParse
};