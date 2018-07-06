const log = require('./ai.log');
const io = require('./ai.io');
const sure = require('./ai.sure');
const fx = require('./ai.fx');
const meta = require('./ai.meta');
const visitor = require('./ai.visitor');
const collection = require('./ai.collection');
const console = require('./ai.console');
const java = require('./ai.java');
const text = require('./ai.text');
const E = require('./ai.error');
module.exports = {
    ...log,
    ...io,
    ...sure,
    ...fx,
    ...meta,
    ...visitor,
    ...collection,
    ...console,
    ...java,
    ...text,
    E,
};