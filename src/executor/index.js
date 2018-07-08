const key = require('./ai.key');
const data = require('./ai.data');
const java = require('./java/ai.java');
const react = require('./react/ai.react');
const exported = {
    ...key,
    ...data,
    ...java,
    ...react
};
module.exports = exported;