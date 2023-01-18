const Ec = require('../epic');
module.exports = () => {
    const actual = Ec.executeInput(
        [
        ],
        [
            ['-p', '--path', "."],
        ]
    );
    Ec.cxExist(actual.path);

    const moduleConfig = Ec.javaSmartMod(actual.path);
    // 执行 initialize.json 写入
}