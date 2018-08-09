const Writer = require('./ui.writer');
const Reader = require('./ui.reader');
const Default = require('./ui.default');
const exported = {
    ...Writer,
    ...Reader,
    ...Default
};
module.exports = exported;