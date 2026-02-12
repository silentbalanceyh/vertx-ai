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
    if (!parsed.name || !String(parsed.name).trim()) {
        Ec.error("缺少必需参数：应用名称");
        Ec.info("参数格式：");
        Ec.info("  -n <名称>    或  --name <名称>");
        Ec.info("示例：");
        Ec.info("  ai app -n my-app");
        Ec.info("  ai app --name my-app");
        process.exit(1);
    }
    if (!Ut.nameValid(parsed.name)) {
        Ec.error("应用名称只能包含字母、数字、点（.）和短横线（-），且不能以数字、点（.）或短横线（-）开头！");
        process.exit(1);
    }
    const configuration = Ut.initAppConfiguration(parsed);
    Ec.info(`准备生成 Zero App 应用：${configuration.artifactId}`);
    configuration.srcType = Symbol("APP");
    Ut.initApp(configuration).then(() => Ec.info(`应用生成完成！`));
}