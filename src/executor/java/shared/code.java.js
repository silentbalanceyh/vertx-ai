const _JavaInterface = require('./code.java.interface');
const _JavaClass = require('./code.java.clazz');

class Java {

    static createInterface(pkg, name) {
        return new _JavaInterface(pkg, name).init();
    }

    static loadInterface(file) {
        return new _JavaInterface(file);
    }

    static loadClass(file) {
        return new _JavaClass(file);
    }

    static createClass(pkg, name) {
        return new _JavaClass(pkg, name).init();
    }
}

module.exports = Java;