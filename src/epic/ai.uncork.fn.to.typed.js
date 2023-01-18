const U = require("underscore");

// Import
const __IT = require("./ai.uncork.fn.it.feature");

const __CX = require("./ai.under.fn.cx.evaluate");
const __FX = require("./ai.under.fn.fx.terminal");

const __LOG = require("./ai.unified.fn._.logging");
// Import Private
const __U = require("./zero.__.fn.find.util");

const __csvJObject = (object = {}, keysData) => {
    const values = [];
    const keys = keysData ? keysData : Object.keys(object);
    keys.forEach(key => values.push(undefined !== object[key] ? object[key] : ""));
    return values;
};
const toJArray = (content = "") => {
    __CX.cxJString(content);
    return JSON.parse(content);
};

const toJObject = (content = "") => {
    __CX.cxJString(content);
    return JSON.parse(content);
};

const toCsv = (array = [], mapping = {}, seperator) => {
    let lines = [];
    if (U.isArray(array) && 0 < array.length) {
        const keys = __U.findMaxFields(array);
        // 转换字段信息
        const formatted = {};
        keys.forEach(key => formatted[key] = key);
        __IT.itObject(mapping, (from, to) => {
            if (formatted.hasOwnProperty(from)) {
                __LOG.info(`字段执行转换：${from.red} -> ${to.blue}`);
                formatted[to] = to;
                delete formatted[from];
            }
        });
        const header = Object.keys(formatted);
        lines.push(header.join(seperator));
        array.forEach(each => {
            __IT.itObject(mapping, (from, to) => {
                if (each.hasOwnProperty(from)) {
                    each[to] = each[from];
                    delete each[from];
                }
            });
            const line = __csvJObject(each, Object.keys(formatted));
            lines.push(line.join(seperator));
        });
        return lines;
    } else {
        __FX.fxError(10001, `value = ${JSON.stringify(array)}, type = ${typeof array}`, "Array")
    }
    return lines;
};
const toTable = (record = {}) => {
    const content = [];
    content.push(`参数名\t\t|\t参数值\t\t|`.blue);
    content.push(`-----------------------------------------`.yellow);
    Object.keys(record).forEach(field => content.push(`${field}\t\t|\t${record[field]}\t\t|`));
    content.push(`-----------------------------------------`.yellow);
    return content.join("\n");
}
module.exports = {
    toCsv,
    toJArray,
    toJObject,
    toTable,
}