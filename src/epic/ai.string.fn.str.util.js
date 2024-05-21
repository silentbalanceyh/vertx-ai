const {v4} = require("uuid");
const Mock = require('mockjs');
const CryptoJS = require('crypto-js');
const __V = require("./zero.__.v.constant");
const strFirstUpper = (value = "") =>
    value.substr(0, 1).toUpperCase() + value.substr(1, value.length);
const strSlashCount = (literal = "") => {
    let counter = 0;
    for (let idx = 0; idx < literal.length; idx++) {
        if (__V.FILE_DELIMITER === literal.charAt(idx)) {
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
const strUuid = () => v4();
// 去掉混淆子母
const strRandom = (length = 64, full = false) => {
    if (full) {
        return Mock.Random.string("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", length);
    } else {
        return Mock.Random.string("ABCDEFGHJKLMNPQRSTUVWXYZ123456789", length);
    }
}

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
const strMD5 = (content) => {
    return CryptoJS.MD5(String(content)).toString().toUpperCase();
}
module.exports = {
    strFirstUpper,
    strSlashCount,
    strShapeCount,
    strUuid,
    strWidth,
    strExpr,
    strRandom,
    strMD5,
    SEPARATOR: __V.FILE_DELIMITER,
};