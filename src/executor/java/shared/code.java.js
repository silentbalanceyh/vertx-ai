const Ux = require('../../../epic');
const Seg = require('./code.segment');

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

class _JavaInterface {
    constructor(pkg, name) {
        this.pkg = pkg;
        this.name = name;
        this.pkgLines = [];
        this.importLines = [];
        this.bodyLines = [];
        this.memberLines = [];
        this.member = {};
    }

    init() {
        Seg.writePackage(this.pkgLines, this.pkg);
        Seg.writeBody(this.bodyLines, this.name);
        return this;
    }

    addMember(name, value, type = "String") {
        if (value) {
            Ux.fxContinue(this.member[name], () => console.warn(Ux.E.fn10012(name, this.name)));
            if (!this.member[name]) {
                Seg.writeInterfaceVariable(this.memberLines, {
                    name, type, value
                });
                this.member[name] = value;
            }
        }
        return this;
    }

    to() {
        let lines = [];
        lines = lines.concat(this.pkgLines);
        lines.push('\n');
        if (0 < this.importLines.length) {
            lines = lines.concat(this.importLines);
            lines.push('\n');
        }
        lines.push(this.bodyLines[0]);
        if (0 < this.memberLines.length) {
            lines = lines.concat(this.memberLines);
        }
        lines.push(this.bodyLines[1]);
        return Ux.joinLines(lines);
    }
}

class Java {

    static createInterface(pkg, name) {
        return new _JavaInterface(pkg, name).init();
    }

    static createClass(pkg, name) {
        return new _JavaClass(pkg, name).init();
    }
}

module.exports = Java;