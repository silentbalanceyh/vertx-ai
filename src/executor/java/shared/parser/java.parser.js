const Ux = require('../../../../epic');
const Spliter = require('./java.spliter');
const zeroName = (line) => {
    let start = -1;
    for (let idx = 0; idx < line.length; idx++) {
        const char = line.charAt(idx);
        if (Spliter.isUpper(char)) {
            start = idx;
            break;
        }
    }
    let end = -1;
    const changed = line + `\n`;
    for (let idx = start; idx < changed.length; idx++) {
        const char = changed.charAt(idx);
        if (!Spliter.isLetter(char)) {
            end = idx;
            break;
        }
    }
    if (start < end) {
        const name = line.substring(start, end).trim();
        if (name) {
            Ux.info(`代码分析：找到定义的类/接口${name.blue}`);
            return name;
        }
    }
};
const zeroVar = (line) => {
    const endIndex = line.split('=')[0].trim().length - 1;
    let startIndex = -1;
    for (let start = endIndex; start > 0; start--) {
        const char = line.charAt(start);
        if (Spliter.isSpace(char)) {
            startIndex = start;
            break;
        }
    }
    if (-1 !== startIndex) {
        const member = line.substring(startIndex, endIndex + 1).trim();
        Ux.info(`代码分析：找到定义的成员变量${member.blue}`);
        return member;
    }
};
const zeroProcess = (meta = []) => {
    const sorted = meta.sort((left, right) => left.lineIndex - right.lineIndex);
    // 包语句
    const pkgLine = sorted.filter(item => item.type === "PACKAGE");
    Ux.fxTerminal(1 < pkgLine.length, Ux.E.fn10014(pkgLine));
    const pkgLines = [pkgLine[0].line + ';'];
    const pkg = pkgLine[0].line.split(' ')[1];
    Ux.info(`代码分析：找到定义的包${pkg.blue}`);
    // 定义语句
    const bodyLine = sorted.filter(item => item.type === "DEFINE");
    const bodyLines = [bodyLine[0].line + '{', '}'];
    const name = zeroName(bodyLine[0].line);
    // Member处理
    const memberLines = [];
    const member = {};
    sorted.forEach((line, index) => {
        if (line.type === "MEMBER_VAR") {
            const previous = sorted[index - 1];
            if (previous && 0 < previous.type.indexOf("COMMENT")) {
                memberLines.push('    ' + previous.line + `\n    ` + line.line + ';\n');
            } else {
                memberLines.push('    ' + line.line + ';\n');
            }
            const valName = zeroVar(line.line);
            member[valName] = line.line.split('=')[1].trim();
        }
    });
    return {
        name,
        pkg,
        member,
        pkgLines,
        bodyLines,
        memberLines
    }
};
const zeroJava = (content) => {
    content = ' ' + content;
    const meta = [];
    for (let idx = 0; idx < content.length; idx++) {
        const metaItem = {};
        const char = content[idx];
        const type = Spliter.analyzeStart(idx, char, content);
        const line = Spliter.findSentence(idx, type, content);
        if (line) {
            metaItem.lineIndex = idx;
            idx = idx + line.length;
            metaItem.line = line.trim();
        }
        if (type) {
            metaItem.type = type;
            meta.push(metaItem);
        }
    }
    return zeroProcess(meta);
};
module.exports = zeroJava;