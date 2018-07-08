const Java = require('./code.java');
const split = require('./code.split');
const annotations = require('./code.annotation');
module.exports = {
    Java,
    ...split,
    ...annotations
};