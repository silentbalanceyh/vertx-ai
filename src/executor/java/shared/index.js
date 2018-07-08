const Java = require('./code.java');
const split = require('./code.split');
const annotations = require('./code.annotation');
const exported = {
    Java,
    ...split,
    ...annotations
};
module.exports = exported;