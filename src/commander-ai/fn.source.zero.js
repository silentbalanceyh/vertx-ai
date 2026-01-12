const Ec = require("../epic");
const Ut = require("../commander-shared");
const request = require("superagent");

module.exports = async (options) => {
    /*
     * 参数解析，解析完成后直接加载基础版本，由于 parseArgument 的通用性，版本解析
     * 只会在 ai zero 等项目初始化命令中完成，所以这里需要单独调用 parseVersion 方法
     * 进行版本解析。
     */
    let parsed = Ut.parseArgument(options);
    parsed = await Ut.parseVersion(parsed);
    /*
     * 基本信息验证
     */
    if (!Ut.nameValid(parsed.name)) {
        Ec.error("应用名称只能包含字母、数字、点（.）和短横线（-），且不能以数字、点（.）或短横线（-）开头！");
        process.exit(1);
    }
    const configuration = await Ut.initZeroConfiguration(parsed);
    Ec.execute(`准备生成 Zero App 应用：${configuration.artifactId}`);
    console.log(configuration);
    await Ut.initZero(configuration);
    Ec.info(`应用生成完成！`);
}