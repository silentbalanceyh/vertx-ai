const menu = require('./generator/menu.js');
const pageList = require('./generator/page-list');
module.exports = {
    ...menu,
    ...pageList
};