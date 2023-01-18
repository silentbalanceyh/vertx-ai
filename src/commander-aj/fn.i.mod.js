const Ec = require('../epic');
module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-p', '--path', "."],
            ['-e', '--extension', ".xlsx"],
            ['-w', '--write', "REPLACE"]
        ]
    );
    Ec.cxExist(actual.path);

    Ec.fxError(!["REPLACE", "APPEND"].includes(actual.write), 10036, actual.write);

    const moduleConfig = Ec.javaSmartMod(actual.path);
    // 执行 initialize.json 写入
    const files = Ec.seekChildren(moduleConfig.path,
        (filename) => filename.endsWith(actual.extension));
    const normalized = [];
    files.forEach(file => normalized.push(`${moduleConfig.prefix}${file}`));

    // 读取 initialize.json 文件并执行合并
    const contentJ = Ec.ioJArray(moduleConfig.out);
    const contentT = Ec.jsonCombine(contentJ, normalized, actual.write);
    Ec.outJson(moduleConfig.out, contentT, true);
}