const Ux = require('../../epic');
const Code = require('./ai.code.react');
const jsUi = () => {
    const actual = Ux.executeInput(
        [],
        [
            ['-n', '--name', '.']
        ]
    );
    const folder = Ux.reactComponentRoot(actual, "UI");

    let reference = null;
    const file = folder.pathComponent + '/' + folder.fileJs;
    if (Ux.isExist(file)) {
        reference = Code.loadClass(folder);
    } else {
        reference = Code.createClass(folder);
    }
    Ux.outString(file, reference.to());
};
module.exports = {
    jsUi
};