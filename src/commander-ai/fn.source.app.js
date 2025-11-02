const Ec = require("../epic");
module.exports = () => {
    /*
     * 参数解析
     */
    const actual = Ec.executeInput(
        [
            ['-n', '--name']
        ],
        [
            ['-p', '--path', "app.json"]
        ]
    );
    /*
     * 基本信息验证
     */
    console.log(actual);
    const name = actual.number;
    const path = actual.path;
    Ec.info(`生成应用信息，应用名称：${name}`);
    Ec.info(`生成应用信息，输出路径：${path}`);
}