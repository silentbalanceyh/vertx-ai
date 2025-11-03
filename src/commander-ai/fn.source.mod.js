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
    const configuration = Ut.initModuleConfiguration(parsed);
    Ec.info(`准备生成 Zero Extension 扩展模块：${configuration.artifactId}`);
    Ut.initMod(configuration).then(() => Ec.info(`模块生成完成！`));
}