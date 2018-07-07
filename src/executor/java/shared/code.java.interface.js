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
            this.annoLines = [];
            this.methodLines = [];
        } else {
            const file = arguments[0];
            const content = Ux.ioString(file);
            const result = codeParser(content);
            this.pkg = result.pkg;
            this.name = result.name;
            this.pkgLines = result.pkgLines;
            this.bodyLines = result.bodyLines;
            this.member = result.member;
            this.memberLines = result.memberLines;
            this.importLines = result.importLines;
            this.annoLines = result.annoLines;
            this.methodLines = result.methodLines;
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

    addImport(clazz) {
        Seg.writeImportLine(this.importLines, clazz);
        return this;
    }

    addAnnotation(line) {
        Seg.writeAnnotation(this.annoLines, line);
        return this;
    }

    addMethod(method, annotations = []) {
        // 添加Annotation
        annotations.forEach(annotation => Seg.writeAnnotation(this.annoLines, annotation));
        // 方法添加
        Seg.writeMethod(this.methodLines, method, annotations, this);
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
        if (0 < this.methodLines.length) {
            lines = lines.concat(this.methodLines);
        }
        lines.push(this.bodyLines[1]);
        return Ux.joinLines(lines);
    }
}

module.exports = _JavaInterface;