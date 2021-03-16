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
const SEPARATOR = SEP;
const strUuid = () => v4();
module.exports = {
    strFirstUpper,
    strSlashCount,
    strUuid,
    SEPARATOR
};