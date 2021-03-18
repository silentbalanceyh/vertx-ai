const Ec = require('../epic');

module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-c', '--config', 'workspace.json']
        ]
    );
    // 基本环境
    const configuration = Ec.javaConfig({
        filename: actual.config,
        tpl: {
            type: 'perm',
            source: 'permission.xlsx'
        }
    });
    if (configuration) Ec.excelRun(configuration);
}
/**
 * ## `aj jperm`
 *
 * ### 1. 命令
 *
 * 使用该命令生成权限模板专用表格数据，初始化权限信息专用。
 *
 * ### 2. 执行
 *
 * #### 2.1. 基本介绍
 *
 * ```shell
 * # 2.1.1. 命令语法
 * aj jperm -c <config>
 *
 * # 2.1.2. 执行测试
 * ai jperm
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "config": "workspace.json"
 * }
 * [Zero AI] 「Java环境」，后端工作路径：<工作目录>。
 * [Zero AI] Zero AI  0. 基础环境......
 * [Zero AI] Zero AI  工作目录：<工作目录>
 * [Zero AI] Zero AI  1. 执行Excel命令......
 * [Zero AI] Zero AI  1.1. 加载数据中......
 * [Zero AI] Zero AI  读取原始文件：<Vert-AI>/src/cab/perm/permission.xlsx
 * [Zero AI] Zero AI  执行Worksheet：DATA-PERM。
 * [Zero AI] Zero AI  分析结果：最大行 - 67，最大列 - 12。
 * [Zero AI] Zero AI  参数表：
 * [Zero AI] Zero AI       MODULE = 业务模块名称
 * [Zero AI] Zero AI       API = URI路径替换标识符
 * [Zero AI] Zero AI       SIGMA = SIGMA统一标识符
 * [Zero AI] Zero AI       IDENTIFIER = 模型统一标识符，对应identifier
 * [Zero AI] Zero AI       PREFIX = 生成文件名前缀
 * [Zero AI] Zero AI       ROLE_ID = 系统中的角色ID
 * [Zero AI] Zero AI       SHEET = 操作的Sheet名称
 * [Zero AI] Zero AI  1.2. 更新数据......
 * [Zero AI] Zero AI  GUID单元格 -         36
 * [Zero AI] Zero AI  数据单元格 -         141
 * [Zero AI] Zero AI  待检查单元格 -       0，（ERROR）
 * [Zero AI] Zero AI  跳过单元格 -         141
 * [Zero AI] Zero AI  1.3. 创建新数据文件......
 * [Zero AI] Zero AI  执行Worksheet：<工作目录>/src/main/resources/init/oob/<生成文件名>.xlsx。
 * [Zero AI] Zero AI  2. 命令执行完成！！！
 * ```
 *
 * 代码执行完成后会在后端工作目录中生成权限文件（可直接导入）。
 *
 * * 执行代码之前可使用`export ZF=XXX`设置后端项目主目录，否则使用配置文件中的`ZF`。
 * * 不支持SIGMA的`formula`替换流程，原始`environment.ambient.xlsx`的引用此处直接消除。
 * * 只生成权限专用的内容
 *
 * ### 3. 选项
 *
 * #### 3.1. 基本说明
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-c|--config|String|`workspace.json`|配置文件路径。|
 *
 * @memberOf module:aj
 * @method jperm
 **/