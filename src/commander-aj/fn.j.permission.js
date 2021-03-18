const Ec = require('../epic');

module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-c', '--config', 'workspace.json']
        ]
    );
    // 基本环境
    const configuration = Ec.javaConfig({
        filename: actual.config,
        tpl: {
            type: 'perm',
            source: 'permission.xlsx'
        }
    });
    if (configuration) Ec.excelRun(configuration);
}