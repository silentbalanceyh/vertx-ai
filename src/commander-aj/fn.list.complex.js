const Ec = require('../epic');
/**
 * ## `aj lcomplex`
 *
 * @memberOf module:aj
 * @method lcomplex
 */
module.exports = () => {
    const actual = Ec.executeInput(
        [
            ['-c', '--config']
        ],
        [
            ['-c', '--config', 'ui.json']
        ]
    );
    // 基本环境监察，得到基础配置信息
    const configuration = Ec.reactEnsure();
    // 配置目录是否存在
    Ec.cxExist(actual.config);
    const inputConfig = Ec.ioJObject(actual.config);
    // 基础配置
    inputConfig.tpl = "list"; // 模板目录
    configuration.input = inputConfig;
    // 构造目录
    Ec.reactReady(configuration, {
        resource: [
            "UI.Add",           // 添加表单资源文件
            "UI.Edit",          // 编程表单资源文件
            "UI.Filter",        // 过滤表单资源文件
            "UI"                // 主界面资源文件
        ],
        ui: [
            "UI",               // 主界面Js
            "Op",               // 主界面事件Js
            "UI.Form",          // 合并过后的Js（三个Form）
        ]
    });
    // 构造文件内容（执行文件绑定）
    Ec.reactRun(configuration);
}