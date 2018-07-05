const log = require('./ai.log');
const io = require('./ai.io');
const sure = require('./ai.sure');
const fx = require('./ai.fx');
const meta = require('./ai.meta');
const visitor = require('./ai.visitor');
const collection = require('./ai.collection');
const console = require('./ai.console');
module.exports = {
    ...log,
    ...io,
    ...sure,
    ...fx,
    ...meta,
    ...visitor,
    ...collection,
    ...console,
};