const Log = require('./ai.log');
const firstUpper = (value = "") =>
    value.substr(0, 1).toUpperCase() + value.substr(1, value.length);
const joinWith = (array = [], separator = ',') => {
    let content = "";
    for (let idx = 0; idx < array.length; idx++) {
        content += array[idx];
        if (idx < array.length - 1) {
            content += separator;
        }
    }
    return content;
};
module.exports = {
    firstUpper,
    joinWith
};