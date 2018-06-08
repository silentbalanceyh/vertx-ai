const menu = require('./generator/menu.js');
const pageList = require('./generator/page-list');
const searchList = require('./generator/search-list');
const tabList = require("./generator/tab-list");
module.exports = {
    ...menu,
    ...pageList,
    ...searchList,
    ...tabList
};