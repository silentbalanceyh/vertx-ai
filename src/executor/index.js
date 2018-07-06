const key = require('./ai.key');
const data = require('./ai.data');
const java = require('./java/ai.java');
module.exports = {
    ...key,
    ...data,
    ...java
};