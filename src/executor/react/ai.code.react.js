const Ux = require('../../epic');
const Seg = require('./ai.code.segment');

class _ReactDefine {
    constructor(config, isNew = true) {
        if (isNew) {
            this.importLines = [];
            this.bodyLines = [];
            this.exportedLines = [];
            this.renderLines = [];
        } else {
            throw new Error("未实现加载流程");
        }
    }

    init() {
        Seg.writeImportLine(this.importLines, 'React', 'react');
        Seg.writeBodyLine(this.bodyLines);
        Seg.writeExportLine(this.exportedLines);
        Seg.writeRenderLine(this.renderLines);
        return this;
    }

    to() {
        let lines = [];
        if (0 < this.importLines.length) {
            lines = lines.concat(this.importLines);
            lines.push('\n');
        }
        lines.push(this.bodyLines[0]);
        if (0 < this.renderLines.length) {
            lines = lines.concat(this.renderLines);
        }
        lines.push(this.bodyLines[1]);
        lines.push(this.exportedLines[0]);
        return Ux.javaJoinLines(lines);
    }
}

module.exports = {
    createClass: (config) => new _ReactDefine(config).init(),
    loadClass: (config) => new _ReactDefine(config, false)
};