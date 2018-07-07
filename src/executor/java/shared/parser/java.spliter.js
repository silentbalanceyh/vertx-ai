const U = require('underscore');
const Immutable = require('immutable');
const Ux = require('../../../../epic');
_extractLineComment = (idx, content) => findLine(idx, content, '\n');
_extractSentence = (idx, content) => findLine(idx, content, ';');
_extractDefine = (idx, content) => findLine(idx, content, '{');
const IDENTIFIERS = {
    "LINE_COMMENT": _extractLineComment,
    "PACKAGE": _extractSentence,
    "IMPORT": _extractSentence,
    "DEFINE": _extractDefine,
    "MEMBER_VAR": _extractSentence
};
const isSpace = (char) => ' ' === char;
const isNewLine = (char) => '\n' === char;
const isLower = (char) => 0 <= 'abcdefghijklmnopqrstuvwxyz'.indexOf(char);
const isUpper = (char) => 0 <= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(char);
const isLetter = (char) => isLower(char) || isUpper(char);
const isKeyword = (literal) => {
    const KEYWORD = [
        "boolean", "int", 'long', 'short', 'byte', 'float', 'double', 'char', // 基本类型
        'class', 'interface', // 引用类型
        'public', 'protected', 'private', // 范围修饰符
        'final', 'void', 'static', 'strictfp', 'abstract', 'transient', 'synchronized', 'volatile', 'native', // 其他修饰符
        'package', 'import', 'throw', 'throws', 'extends', 'implements', 'this', 'super', 'instanceof', 'new', // 动作
        'true', 'false', 'null', 'goto', 'const', // 保留
        'if', 'else', 'do', 'while', 'for', 'switch', 'case', 'default', 'break', 'continue', 'return', 'try', 'catch', 'finally' // 流程
    ];
    const $keyword = Immutable.fromJS(KEYWORD);
    return $keyword.contains(literal);
};
const findNonSpace = (current, content) => {
    let start = current;
    for (let idx = start; idx < content.length; idx++) {
        const char = content.charAt(idx);
        if (!isSpace(char) && !isNewLine(char)) {
            start = idx;
            break;
        }
    }
    return start;
};
const findUnitl = (current, content, char = ' ') => {
    let end;
    const start = current;
    let found = null;
    do {
        found = content.charAt(current);
        current++;
    } while (char !== found && !isNewLine(found) && !isSpace(found) && current < content.length);
    end = current;
    if (end && start < end) {
        return content.substring(start, end - 1);
    }
};

const findLine = (current, content, char) => {
    if (char) {
        let end;
        const start = current;
        let found = null;
        do {
            found = content.charAt(current);
            current++;
        } while (char !== found && current < content.length);
        end = current;
        if (end && start < end) {
            return content.substring(start, end - 1);
        }
    }
};

const findKeywordUntil = (current, content) => {
    const word = findUnitl(current, content);
    let words = [];
    if (isKeyword(word)) {
        words.push(word);
        // 查找word之后下一个非中断字符
        const start = findNonSpace(current + word.length, content);
        const nexts = findKeywordUntil(start, content);
        if (0 < nexts.length) {
            words = words.concat(nexts);
        }
    }
    return words;
};

const analyzeType = (previous, currentIndex, next, content) => {
    // 三个符号：空白或
    const char = content.charAt(currentIndex);
    if (isSpace(previous) || isNewLine(previous)) {
        // 行注释
        if ('/' === char && '/' === next) {
            return "LINE_COMMENT";
        }
        if ('/' === char && '*' === next) {
            return "BLOCK_COMMENT";
        }
        const word = findUnitl(currentIndex, content);
        if ("package" === word) {
            // package语句
            return "PACKAGE";
        } else if ("import" === word) {
            // import语句
            return "IMPORT";
        } else if (isKeyword(word)) {
            const keywords = findKeywordUntil(currentIndex, content);
            const $keywords = Immutable.fromJS(keywords);
            if ($keywords.contains("class") || $keywords.contains("interface")) {
                return "DEFINE"
            }
        } else if (isLetter(char)) {
            // 完整语句
            let whole = findLine(currentIndex, content, ';');
            // 从语句中去掉字符串部分
            whole = whole.replace(/"*"/g, '');
            if (0 >= whole.indexOf('(') && 0 >= whole.indexOf(')')) {
                return "MEMBER_VAR"
            }
        }
    }
};
const analyzeStart = (idx, char, content) => {
    // console.info(idx, char);
    const previous = content.charAt(idx - 1);
    const next = content.charAt(idx + 1);
    return analyzeType(previous, idx, next, content);
};
const findSentence = (idx, type, content) => {
    if (type) {
        content = ' ' + content;
        const fun = IDENTIFIERS[type];
        Ux.fxTerminal(!U.isFunction(fun), Ux.E.fn10013(type));
        let line = fun(idx, content);
        if (line) line = line.trim();
        return line;
    }
};
module.exports = {
    analyzeStart,
    findSentence,
    isUpper,
    isSpace,
    isLower,
    isLetter
};