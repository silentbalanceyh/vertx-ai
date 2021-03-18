const path = require('path');
const {v4} = require("uuid");
const SEP = path.sep;
const strFirstUpper = (value = "") =>
    value.substr(0, 1).toUpperCase() + value.substr(1, value.length);
const strSlashCount = (literal = "") => {
    let counter = 0;
    for (let idx = 0; idx < literal.length; idx++) {
        if (SEP === literal.charAt(idx)) {
            counter++;
        }
    }
    return counter;
};
const strShapeCount = (literal = "") => {
    let counter = 0;
    for (let idx = 0; idx < literal.length; idx++) {
        if ("#" === literal.charAt(idx)) {
            counter++;
        }
    }
    return counter;
}
const SEPARATOR = SEP;
const strUuid = () => v4();
const strWidth = (input = "") => {
    let content = "";
    const space = 16 - input.length;
    for (let i = 0; i < space; i++) {
        content += " ";
    }
    return content + input;
}
const strExpr = (content, params = {}) => {
    Object.keys(params).forEach(name => {
        const expression = new RegExp(`#${name}#`, 'g');
        content = content.replace(expression, params[name]);
    });
    return content;
}
module.exports = {
    strFirstUpper,
    strSlashCount,
    strShapeCount,
    strUuid,
    strWidth,
    strExpr,
    SEPARATOR
};