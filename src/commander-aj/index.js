const reactComplex = require('./fn.i.complex');
const reactForm = require('./fn.i.form');
const javaPermission = require('./fn.j.permission');
const javaResource = require('./fn.i.resource');
const javaPlugin = require('./fn.j.plugin');
const javaMod = require('./fn.i.mod');
const javaInit = require('./fn.j.init');
const exported = {
    reactComplex,
    reactForm,
    javaPermission,
    javaResource,
    javaPlugin,
    javaMod,
    javaInit,           // aj jinit
};
module.exports = exported;