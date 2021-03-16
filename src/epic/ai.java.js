const Io = require('./ai.io');
const Fx = require('./ai.fx');
const javaRoot = () => {
    const current = process.cwd();
    let root = "";
    if (0 < current.indexOf('src/main/java')) {
        // 已经位于目录之下
        root = Io.dirParent(current);
    } else {
        // 未进入项目目录中
        root = Io.dirChildren(current);
    }
    root = root.filter(item => item.endsWith('src/main/java'));
    Fx.fxError(1 < root.length, 10010, root);
    root = root[0];
    return Io.dirResolve(root);
};
const javaJoinLines = (lines = []) => {
    let content = '';
    lines.forEach(line => content += `${line}\n`);
    return content.replace(`\n\n`, `\n`);
};
const javaParseMethod = (input) => {
    const line = input.replace(/\[/g, '').replace(/]/g, '').trim();
    const splitted = line.split('-');
    const name = splitted[0];
    const paramArr = splitted[1].split('|');
    const returnValue = splitted[2];
    const ws = splitted[3];
    const params = [];
    paramArr.forEach(param => {
        const kv = param.split(':');
        const item = {};
        item.name = kv[0];
        item.type = kv[1];
        item.annotation = kv[2];
        params.push(item);
    });
    return {
        name, params, returnValue, ws
    }
};
module.exports = {
    javaRoot,
    javaJoinLines,
    javaParseMethod
};