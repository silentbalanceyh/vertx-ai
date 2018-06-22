const menu = require('./generator/menu.js');
const pageList = require('./generator/page-list');
const searchList = require('./generator/search-list');
const tabList = require("./generator/tab-list");
const fullList = require('./generator/full-list');
const keyApply = require("./generator/key-apply");
module.exports = {
    ...menu,
    ...pageList,
    ...searchList,
    ...tabList,
    ...fullList,
    ...keyApply
};