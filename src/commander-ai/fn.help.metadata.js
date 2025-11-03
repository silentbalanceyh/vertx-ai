const Ec = require('../epic');
const os = require('os');
const Ut = require("../commander-shared");
module.exports = (options) => {
    const metadata = Ut.parseMetadata();
    metadata.forEach(runner => {
        Ec.execute(`命令：` + `ai ${runner.command} [-options]`.green);
        Ec.execute(`说明：${runner.description}`.yellow);
        runner.options.forEach(option => {
            if (option.hasOwnProperty('default')) {
                const str = option.default + '';
                Ec.execute(`\t-${option.alias},--${option.name}`.red + `\t${option.description}, 默认值：\uD83C\uDF37 ` + str.blue);
            } else {
                Ec.execute(`\t-${option.alias},--${option.name}`.red + `\t${option.description}`);
            }
        })
        Ec.execute();
    });
    Ec.info("命令执行完成！")
}