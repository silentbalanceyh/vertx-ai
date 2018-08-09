const Ux = require('../../epic');
const _verifyPath = (path) => {
    Ux.fxTerminal(!path, Ux.E.fn10027(path));
    const counter = Ux.countSlash(path);
    Ux.fxTerminal(1 !== counter, Ux.E.fn10027(path));
    Ux.fxTerminal(path.startsWith("src/components"), Ux.E.fn10027(path));
    return path;
};
const jsUiForm = () => {
    const actual = Ux.executeInput(
        [
            ['-m', '--module'],
            ['-o', '--out']
        ],
        [
            ['-m', '--module'],
            ['-o', '--out'],
            ['-n', '--name', "UI.Form"],
            ['-y', '--yes', false]
        ]
    );
    const path = _verifyPath(actual["out"]);
    console.info(actual);
};

module.exports = {
    jsUiForm
};