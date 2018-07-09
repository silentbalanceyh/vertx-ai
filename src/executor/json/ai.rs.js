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
    // 资源文件路径地址
    Ux.makeDirs(config.pathResource);
    const resource = config.pathResource + '/' + config.fileJson;
    Ux.outJson(resource, configData);
};
module.exports = {
    rsUi
};