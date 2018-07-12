const E = require('./ai.error');
const Fx = require('./ai.fx');
const elementZipper = (source = [], target = [], merged = false) => {
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
const elementFind = (array = [], field, value) => {
    if (field && value) {
        const filtered = array.filter(item => value === item[field]);
        Fx.fxTerminal(1 < filtered.length, E.fn10021(field, value));
        return filtered[0];
    }
};
const exported = {
        elementZipper,
        elementFind
    }
;
module.exports = exported;