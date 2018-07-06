const Io = require('./ai.io');
const E = require('./ai.error');
const Fx = require('./ai.fx');
const javaRoot = () => {
    const current = process.cwd();
    let root = "";
    if (0 < current.indexOf('src/main/java')) {
        // 已经位于目录之下
        root = Io.cycleParent(current);
    } else {
        // 未进入项目目录中
        root = Io.cycleChildren(current);
    }
    root = root.filter(item => item.endsWith('src/main/java'));
    Fx.fxTerminal(1 < root.length, E.fn10010(root));
    root = root[0];
    return Io.resolveDirectory(root);
};
module.exports = {
    javaRoot
};