const Fx = require('./ai.fx');
/**
 * ## `Ec.elementZip`
 *
 * （后期将升级或被废弃）
 *
 * @memberOf module:epic
 * @deprecated
 * @param {Array} source 原数组
 * @param {Array} target 目标数组
 * @param {Boolean} merged 执行合并的模式，覆盖和追加
 * @returns {Object} 返回最终的数据信息
 */
const elementZip = (source = [], target = [], merged = false) => {
    const length = Math.min(source.length, target.length);
    const dataItem = {};
    for (let idx = 0; idx < length; idx++) {
        if (merged) {
            dataItem[source[idx]] = target[idx];
        } else {
            dataItem['source'] = source[idx];
            dataItem['target'] = target[idx];
        }

    }
    return dataItem;
};
/**
 * ## `Ec.elementUnique`
 *
 * ### 1. 基本介绍
 *
 * 在输入数组中查找`field = value`的唯一元素对象。
 *
 * @memberOf module:epic
 * @param {Array} array 输入数组信息
 * @param {String} field 查找的字段信息
 * @param {Any} value 执行过滤和匹配的`field = value`的值
 * @returns {*} 返回查找的唯一元素
 */
const elementUnique = (array = [], field, value) => {
    if (field && value) {
        const filtered = array.filter(item => value === item[field]);
        Fx.fxError(1 < filtered.length, 10021, field, value);
        return filtered[0];
    }
};
const exported = {
    elementZip,
    elementUnique
};
module.exports = exported;