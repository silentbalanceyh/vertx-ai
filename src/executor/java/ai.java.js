const zeroApi = require('./ai.zero');
const zeroIpc = require('./ai.ipc');
const exported = {
    ...zeroApi,
    ...zeroIpc
};
module.exports = exported;