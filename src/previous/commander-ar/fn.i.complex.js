const Ec = require('../../epic');

module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-c', '--config', 'ui.json']
        ]
    );
    // 基本环境监察，得到基础配置信息
    const configuration = Ec.reactConfig({
        filename: actual.config,
        tpl: {
            type: 'list',
        },
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
    if (configuration) Ec.reactRun(configuration);
}
/**
 * ## `art complex`
 *
 * ### 1. 命令
 *
 * ```shell
 * art complex
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-c|--config|String|`ui.json`|配置文件路径。|
 *
 * ### 2. 介绍
 *
 * 使用该命令生成完整的`ExListComplex`完整组件页。
 *
 * ### 3. 执行
 *
 * ```shell
 * art complex
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "config": "ui.json"
 * }
 * [Zero AI] 「启用ZT环境」，当前模块：generated/test，特殊命令只能在ZT环境使用。
 * [Zero AI] Zero AI  0. 基础环境......
 * [Zero AI] 环境变量：ZT = generated/test
 * [Zero AI] 模块信息：generated/test
 * [Zero AI] 语言信息：cn
 * [Zero AI] 项目目录：<项目根目录>
 * [Zero AI] Zero AI  1. 目录检查......
 * [Zero AI] Zero AI  2. 文件表：
 * [Zero AI]           UI.Add = <项目根目录>/src/cab/cn/components/generated/test/UI.Add.json
 * [Zero AI]          UI.Edit = <项目根目录>/src/cab/cn/components/generated/test/UI.Edit.json
 * [Zero AI]        UI.Filter = <项目根目录>/src/cab/cn/components/generated/test/UI.Filter.json
 * [Zero AI]               UI = <项目根目录>/src/cab/cn/components/generated/test/UI.json
 * [Zero AI]               UI = <项目根目录>/src/components/generated/test/UI.js
 * [Zero AI]               Op = <项目根目录>/src/components/generated/test/Op.js
 * [Zero AI]          UI.Form = <项目根目录>/src/components/generated/test/UI.Form.js
 * [Zero AI] Zero AI  3. 执行React命令......
 * [Zero AI] Zero AI       3.1. 创建名空间文件......
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/components/generated/test/Cab.json！
 * [Zero AI] Zero AI       3.2. 构造资源文件......
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/cab/cn/components/generated/test/UI.Add.json！
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/cab/cn/components/generated/test/UI.Edit.json！
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/cab/cn/components/generated/test/UI.Filter.json！
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/cab/cn/components/generated/test/UI.json！
 * [Zero AI] Zero AI       3.3. 构造界面文件......
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/components/generated/test/UI.js！
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/components/generated/test/Op.js！
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/components/generated/test/UI.Form.js！
 * [Zero AI] Zero AI  4. 命令执行完成！！！
 * ```
 *
 * 代码执行完成后会在项目中生成Zero UI专用模块`generated/test`的所有页面以及组件。
 *
 * * 执行代码之前先执行`export ZT=generated/test`确保`ZT`环境变量有值。
 * * 执行位置可以是当前项目中的任意一个路径，脚本会自己计算当前项目的根目录（Zero UI专用）。
 * * 该命令执行时模板文件位置位于`src/cab/list`目录中，且模板文件以`tpl`结尾。
 *
 * ### 4. 生成的文件说明
 *
 * |文件名|模板|含义|
 * |:---|:---|:---|
 * |Cab.json|无|名空间关联文件，计算得来。|
 * |UI.Add.json|UI.Add.json.tpl|「无字段」添加表单专用资源文件。|
 * |UI.Edit.json|UI.Edit.json.tpl|「无字段」编辑表单专用资源文件。|
 * |UI.Filter.json|UI.Filter.json.tpl|过滤表单专用资源文件（高级搜索用）。|
 * |UI.json|UI.json.tpl|主界面资源文件。|
 * |UI.js|UI.js.tpl|主界面脚本文件。|
 * |Op.js|Op.js.tpl|Action/Callback专用Js事件脚本。|
 * |UI.Form.js|UI.Form.js.tpl|三个表单合一的专用Js脚本。|
 *
 * @memberOf module:art
 * @method complex
 */