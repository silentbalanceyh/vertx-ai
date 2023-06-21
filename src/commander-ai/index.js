const executeUuid = require('./fn.uuid');
const executeCsv = require('./fn.csv');
const executeUk = require('./fn.uk');
const executeKey = require('./fn.key');
const executeData = require('./fn.data');
const executeInit = require('./fn.init');
const executeString = require('./fn.random');
const executeMD5 = require('./fn.md5');
const executeSync = require('./fn.sync');
const exported = {
    executeUuid,        // ai uuid
    executeCsv,         // ai csv
    executeUk,          // ai uk
    executeKey,         // ai key
    executeData,        // ai data
    executeInit,        // ai init
    executeString,      // ai str
    executeMD5,         // ai md5
    executeSync,        // ai sync
};
module.exports = exported;