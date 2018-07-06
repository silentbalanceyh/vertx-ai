const Ux = require('../../../epic');
const Seg = require('./code.segment');
const codeParser = require('./parser/java.parser');

class _JavaInterface {
    constructor(pkg, name) {
        if (2 === arguments.length) {
            this.pkg = pkg;
            this.name = name;
            this.pkgLines = [];
            this.importLines = [];
            this.bodyLines = [];
            this.memberLines = [];
            this.member = {};
        } else {
            const file = arguments[0];
            const content = Ux.ioString(file);
            const result = codeParser(content);
        }
    }

    init() {
        Seg.writePackage(this.pkgLines, this.pkg);
        Seg.writeBody(this.bodyLines, this.name);
        return this;
    }

    addMember(name, value, type = "String") {
        if (value) {
            if (!this.member[name]) {
                Seg.writeInterfaceVariable(this.memberLines, {
                    name, type, value
                });
                this.member[name] = value;
            } else {
                Ux.warn(Ux.E.fn10012(name, this.name))
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

module.exports = _JavaInterface;