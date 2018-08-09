const Ux = require('../../../epic');
const _verifyPath = (path) => {
    Ux.fxTerminal(!path, Ux.E.fn10027(path));
    const counter = Ux.countSlash(path);
    Ux.fxTerminal(1 !== counter, Ux.E.fn10027(path));
    Ux.fxTerminal(path.startsWith("src/components"), Ux.E.fn10027(path));
    return path;
};
const onOut = (actual = {}) => {
    const out = process.env.ZT;
    Ux.fxTerminal(!out, Ux.E.fn10029(out));
    actual.out = _verifyPath(out);
};
module.exports = {
    onOut
};