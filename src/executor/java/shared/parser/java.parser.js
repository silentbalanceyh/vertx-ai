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
const zeroAnnotation = (index, sorted = [], array = [], indent = '') => {
    for (let idx = index - 1; idx > 0; idx--) {
        const previous = sorted[idx];
        if ("ANNOTATION" === previous.type || 0 < previous.type.indexOf("COMMENT")) {
            array.push(indent + previous.line);
        } else {
            break;
        }
    }
};
const zeroDefineWithAnnotation = (sorted = []) => {
    const bodyLines = [];
    let name = null;
    const defineLine = [];
    sorted.forEach((each, index) => {
        if ("DEFINE" === each.type) {
            name = zeroName(each.line);
            defineLine.push(each.line + '{');
            zeroAnnotation(index, sorted, defineLine);
        }
    });
    bodyLines.push(Ux.joinLines(defineLine.reverse()));
    bodyLines.push('}');
    return {
        bodyLines,
        name
    }
};
const zeroAMethodWithAnnotation = (sorted = []) => {
    const methodLines = [];
    let methodLine = [];
    let method = {};
    sorted.forEach((each, index) => {
        if ("ABSTRACT_METHOD" === each.type) {
            methodLine.push('    ' + each.line + ';');
            zeroAnnotation(index, sorted, methodLine, '    ');
            methodLines.push(Ux.joinLines(methodLine.reverse()));
            const methodName = zeroMethodName(each.line);
            if (methodName) method[methodName] = methodName;
            methodLine = [];
        } else if ("METHOD" === each.type) {
            methodLine.push('    ' + each.line);
            zeroAnnotation(index, sorted, methodLine, '    ');
            methodLines.push(Ux.joinLines(methodLine.reverse()));
            const methodName = zeroMethodName(each.line);
            if (methodName) method[methodName] = methodName;
            methodLine = [];
        }
    });
    return {
        methodLines, method
    };
};
const zeroMethodName = (item = "") => {
    let name = null;
    const end = item.indexOf('(');
    for (let idx = end; idx > 0; idx--) {
        const char = item.charAt(idx);
        if (' ' === char) {
            const method = item.substring(idx, end);
            Ux.info(`代码分析：找到已定义的方法${method.blue}`);
            name = method.trim();
            break;
        }
    }
    return name;
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
    const {bodyLines, name} = zeroDefineWithAnnotation(sorted);
    // Import语句
    const importLine = sorted.filter(item => item.type === "IMPORT");
    let importLines = [];
    importLine.forEach(line => importLines.push(line.line + ';'));
    // 方法专用
    const {methodLines, method} = zeroAMethodWithAnnotation(sorted);
    // Annotation
    const annoLine = sorted.filter(item => item.type === "ANNOTATION");
    let annoLines = [];
    annoLine.forEach(line => annoLines.push(line.line));
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
        method,
        pkgLines,
        bodyLines,
        memberLines,
        importLines,
        annoLines,
        methodLines
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
    // meta.forEach(item => console.info(item))
    return zeroProcess(meta);
};
module.exports = zeroJava;