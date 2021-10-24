const executeUuid = require('./fn.uuid');
const executeCsv = require('./fn.csv');
const executeUk = require('./fn.uk');
const executeKey = require('./fn.key');
const executeData = require('./fn.data');
const executeInit = require('./fn.init');
const exported = {
    executeUuid,        // ai uuid
    executeCsv,         // ai csv
    executeUk,          // ai uk
    executeKey,         // ai key
    executeData,        // ai data
    executeInit,        // ai init
};
module.exports = exported;