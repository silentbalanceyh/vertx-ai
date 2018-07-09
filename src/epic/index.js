const log = require('./ai.log');
const io = require('./ai.io');
const sure = require('./ai.sure');
const fx = require('./ai.fx');
const meta = require('./ai.meta');
const visitor = require('./ai.visitor');
const collection = require('./ai.collection');
const console = require('./ai.console');
const word = require('./ai.word');

const E = require('./ai.error');

const java = require('./ai.java');
const react = require('./ai.react');

const exported = {
    ...log,
    ...io,
    ...sure,
    ...fx,
    ...word,

    ...meta,
    ...visitor,
    ...collection,
    ...console,

    ...java,
    ...react,
    E,
};
module.exports = exported;