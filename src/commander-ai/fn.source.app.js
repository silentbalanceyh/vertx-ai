const Ec = require("../epic");
const Ut = require("../commander-shared");

module.exports = (options) => {
    /*
     * 参数解析
     */
    const parsed = Ut.parseArgument(options);
    /*
     * 基本信息验证
     */
    const name = parsed.name;
    console.log(parsed);
    Ec.info(`生成应用信息，应用名称：${name}`);
}