const executeCPage = require('./fn.page.complex');
const executeQPage = require('./fn.page.query');
const executeOPage = require('./fn.page.open');
const exported = {
    executeCPage,
    executeQPage,
    executeOPage,
};
module.exports = exported;