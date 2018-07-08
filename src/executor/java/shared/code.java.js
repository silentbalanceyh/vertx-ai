const _JavaDefine = require('./code.java.define');

class Java {

    static createInterface(pkg, name) {
        return new _JavaDefine(pkg, name).init();
    }

    static loadInterface(file) {
        return new _JavaDefine(file);
    }

    static loadClass(file) {
        return new _JavaDefine(file);
    }

    static createClass(pkg, name) {
        return new _JavaDefine(pkg, name).init(true);
    }
}

module.exports = Java;