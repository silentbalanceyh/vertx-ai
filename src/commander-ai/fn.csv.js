const Ec = require('../epic');
const Immutable = require('immutable');

module.exports = () => {
    const actual = Ec.executeInput(
        ['-p', '--path'],
        [
            ['-p', '--path'],
            ['-c', '--config', null],
            ['-s', '--separator', ',']
        ]
    );
    Ec.cxExist(actual.path);
    // 读取配置信息
    const data = Ec.ioJObject(actual.path);
    let $data = Immutable.fromJS(data).get('data');
    $data = $data && $data.toJS ? $data.toJS() : [];
    let mapping = Ec.fxContinue(Ec.isExist(actual.config), () => Ec.parseZero(actual.config));
    // Csv
    Ec.info(`使用分隔符：${actual.separator.green}`);
    const csvArr = Ec.toCsv($data, mapping, actual.separator);
    const csvData = csvArr.join('\n');
    Ec.outString('.' + Ec.SEPARATOR + Ec.strUuid() + ".csv", csvData);
};