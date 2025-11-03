const _ARGS = require("./ai.fn.parse.argument");
const _MODS = require("./ai.fn.initialize.module");
const _APPS = require("./ai.fn.initialize.app");
const _SPRING = require("./ai.fn.initialize.spring");
module.exports = {
    ..._ARGS,
    ..._MODS,
    ..._APPS,
    ..._SPRING,
    nameValid: (str) => {
        if (typeof str !== 'string' || str.length === 0) {
            return false;
        }

        // 检查是否以数字、. 或 - 开头
        if (/^[0-9.\-]/.test(str)) {
            return false;
        }

        // 检查是否只包含字母、数字、. 和 -
        if (!/^[a-zA-Z0-9.\-]+$/.test(str)) {
            return false;
        }
        return true;
    }
}