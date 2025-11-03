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
    if (!Ut.nameValid(parsed.name)) {
        Ec.error("应用名称只能包含字母、数字、点（.）和短横线（-），且不能以数字、点（.）或短横线（-）开头！");
        process.exit(1);
    }
    const configuration = Ut.initSpringConfiguration(parsed);
    Ec.info(`准备生成 Rapid Spring App 应用：${configuration.artifactId}`);
    configuration.srcType = Symbol("SPRING");
    Ut.initSpring(configuration).then(() => Ec.info(`应用生成完成！`));
}