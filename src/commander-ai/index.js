const executeUuid = require('./fn.uuid');
const executeCsv = require('./fn.csv');
const executeUk = require('./fn.uk');
const exported = {
    executeUuid,        // ai uuid
    executeCsv,         // ai csv
    executeUk,          // ai uk
};
module.exports = exported;