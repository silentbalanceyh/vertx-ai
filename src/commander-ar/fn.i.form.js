const Ec = require('../epic');

module.exports = () => {
    const actual = Ec.executeInput(
        [
            ['-u', '--ui']
        ],
        [
            ['-c', '--config', 'ui.json'],
            ['-u', '--ui']
        ]
    );
    // 基本环境监察，得到基础配置信息
    const configuration = Ec.reactConfig({
        filename: actual.config,
        tpl: {
            type: 'form',
            source: 'UI',
            target: actual.ui,
        }
    });
    if (configuration) Ec.reactRun(configuration);
}
/**
 * ## `aj iform`
 *
 * ### 1. 命令
 *
 * 使用该命令生成完整的`ExForm`完整表单组件页。
 *
 * ### 2. 执行
 *
 * #### 2.1. 基本介绍
 *
 * ```shell
 * # 2.1.1. 命令语法
 * ai iform -u <ui>
 *
 * # 2.1.2. 执行测试
 * aj iform -u UI.Basic
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "config": "ui.json",
 *      "ui": "UI.Basic"
 * }
 * [Zero AI] 「启用ZT环境」，当前模块：generated/test，特殊命令只能在ZT环境使用。
 * [Zero AI] Zero AI  0. 基础环境......
 * [Zero AI] 环境变量：ZT = generated/test
 * [Zero AI] 模块信息：generated/test
 * [Zero AI] 语言信息：cn
 * [Zero AI] 项目目录：<项目根目录>
 * [Zero AI] Zero AI  1. 目录检查......
 * [Zero AI] Zero AI  2. 文件表：
 * [Zero AI] Zero AI  3. 执行React命令......
 * [Zero AI] Zero AI       3.1. 创建名空间文件......
 * [Zero AI] Zero AI       3.2. 构造资源文件......
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/cab/cn/components/generated/test/UI.Basic.json！
 * [Zero AI] Zero AI       3.3. 构造界面文件......
 * [Zero AI] （Sync）成功将数据写入到文件：<项目根目录>/src/components/generated/test/UI.Basic.js！
 * [Zero AI] Zero AI  4. 命令执行完成！！！
 * ```
 *
 * 代码执行完成后会在项目中生成Zero UI专用模块`generated/test`中唯一的两个页面。
 *
 * * 执行代码之前先执行`export ZT=generated/test`确保`ZT`环境变量有值。
 * * 该命令执行时模板文件位置位于`src/cab/form`目录中，且模板文件以`tpl`结尾。
 * * 生成的`UI.js`的按钮部分直接位于当前文件中，并且默认包含了`ADD, EDIT, DELETE`三个核心按钮。
 *
 * #### 2.2. 生成的文件说明
 *
 * |文件名|模板|含义|
 * |:---|:---|:---|
 * |Cab.json|无|名空间关联文件，计算得来。|
 * |`<Name>.json`|UI.json.tpl|当前表单专用资源文件。|
 * |`<Name>.js`|UI.js.tpl|当前表单源代码专用文件。|
 *
 *
 * ### 3. 选项
 *
 * #### 3.1. 基本说明
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-u|--ui|String|无|生成的文件名，最终生成`<Name>.json/<Name>.js`|
 * |-c|--config|String|`ui.json`|配置文件路径。|
 *
 * @memberOf module:aj
 * @method iform
 */