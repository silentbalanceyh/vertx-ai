const Ux = require('../../epic');
const rsUi = () => {
    const actual = Ux.executeInput(
        [],
        [
            ['-n', '--name', '.'],
            ['-t', '--target', 'UI']
        ]
    );
    const config = Ux.reactResourceRoot(actual, actual.target);
    Ux.fxTerminal(!Ux.isExist(config.fileZero), Ux.E.fn10018(config.fileZero));
    const configData = Ux.zeroParse(config.fileZero);
    console.info(configData);
};
module.exports = {
    rsUi
};