const _JavaInterface = require('./code.java.interface');

class _JavaClass {
    constructor(pkg, name) {
        this.pkg = pkg;
        this.name = name;
        this.pkgLines = [];
        this.importLines = [];
        this.bodyLines = [];
        this.memberLines = [];
    }
}

class Java {

    static createInterface(pkg, name) {
        return new _JavaInterface(pkg, name).init();
    }

    static loadInterface(file) {
        return new _JavaInterface(file);
    }

    static createClass(pkg, name) {
        return new _JavaClass(pkg, name).init();
    }
}

module.exports = Java;