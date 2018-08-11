const Ux = require('../../epic');
const path = require('path');

const SEPRATOR = path.sep;

const Code = require('./ai.code.react');
const _jsZero = (config, reference) => {
    if (Ux.isExist(config.fileZero)) {
        Ux.info(`Zero，检测到zero配置文件${config.fileZero.cyan}`);
        const zeroConfig = Ux.zeroParse(config.fileZero);
        Ux.info(`Zero配置信息：\n${JSON.stringify(zeroConfig).blue}`);
    } else {
        Ux.warn(`Zero，未找到配置文件${config.fileZero}，跳过Zero UI的创建`);
    }
};
const jsUi = () => {
    const actual = Ux.executeInput(
        [],
        [
            ['-n', '--name', '.']
        ]
    );
    const config = Ux.reactComponentRoot(actual, "UI");

    let reference = null;
    const file = config.pathComponent + SEPRATOR + config.fileJs;
    if (Ux.isExist(file)) {
        reference = Code.loadClass(config);
    } else {
        reference = Code.createClass(config);
    }
    // 设置Zero相关配置
    _jsZero(config, reference);
    console.info(reference.to());
};
module.exports = {
    jsUi,
};