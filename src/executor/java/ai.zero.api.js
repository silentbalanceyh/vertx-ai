const Ux = require('../../epic');
const Zero = require('./zero');
const zeroApi = () => {
    const actual = Ux.executeInput(
        ['-c', '--config'],
        [
            ['-c', '--config'],
            ['-p', '--path', '.zero/java'],
        ]
    );
    const folder = Ux.javaRoot();
    const configFile = actual.path + '/' + actual.config + '.zero';
    const configData = Ux.zeroParse(configFile);
    // 执行常量处理
    Ux.fxTerminal(!configData.api, Ux.E.fn10011(configData));
    Zero.goCv(configData, folder);
    // 执行Api Agent处理
};
module.exports = {
    zeroApi
};