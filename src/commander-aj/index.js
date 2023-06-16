
const javaPermission = require('./fn.j.permission');
const javaResource = require('./fn.i.resource');
const javaPlugin = require('./fn.j.plugin');
const javaMod = require('./fn.i.mod');
const javaInit = require('./fn.j.init');
const javaBundle = require('./fn.j.bundle');
const exported = {
    javaPermission,
    javaResource,
    javaPlugin,
    javaMod,
    javaInit,           // aj jinit
    javaBundle,
};
module.exports = exported;