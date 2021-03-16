const executeUuid = require('./fn.uuid');
const executeCsv = require('./fn.csv');
const exported = {
    executeUuid,        // ai uuid
    executeCsv,         // ai csv
};
module.exports = exported;