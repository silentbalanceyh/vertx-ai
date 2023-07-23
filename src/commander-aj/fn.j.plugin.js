const Ec = require('../epic');

module.exports = () => {
    const actual = Ec.executeInput(
        [
            ["-m", "--module"]
        ],
        [
            ["-m", "--module"],
            ['-p', "--path"],
            ['-c', '--config', 'workspace.json']
        ]
    );
    Ec.cxExist(actual.config);
    // 基本环境
    const configuration = Ec.javaConfig({
            filename: actual.config,
            module: actual.module,
            tpl: {
                type: 'plugin'
            }
        },
        "." === actual.path ? process.cwd() : actual.path,
        Ec.Cfg.detectPlugin
    );
    if (configuration) Ec.pluginRun(configuration);
}

/**
 * ## `aj plugin`
 *
 * ### 1. 命令
 *
 * ```shell
 * aj plugin -m pbc
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|无|根据传入路径设置，如果是`.`则是当前目录，如果不传则从`workspace.json`中读取。|
 * |-m|--module|String|无|模块名称，通常是`infix-xxx`中的`xxx`名称。|
 * |-c|--config|String|`workspace.json`|配置文件路径。|
 *
 * ### 2. 介绍
 *
 * 使用该命令执行插件项目初始化，设置第三方集成项目模板专用。
 *
 * ### 3. 执行
 *
 * ```shell
 * aj plugin -m pbc
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "module": "pbc",
 *      "config": "workspace.json"
 * }
 * [Zero AI] 「Java环境」，后端工作路径：<工作目录>。
 * [Zero AI] Zero AI  0. 基础环境......
 * [Zero AI] Zero AI  工作目录：<工作目录>
 * [Zero AI] Zero AI  1. 执行Plugin命令......
 * [Zero AI] Zero AI       1.1. 初始化源代码目录......
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/component
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/cv
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/error
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/input
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/output
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/refine
 * [Zero AI] 创建目录：<工作目录>/src/main/java/cn/originx/pbc/plugin
 * [Zero AI] Zero AI       1.2. 初始化资源目录......
 * [Zero AI] 创建目录：<工作目录>/src/main/resources/plugin
 * [Zero AI] 创建目录：<工作目录>/src/main/resources/plugin/pbc
 * [Zero AI] 创建目录：<工作目录>/src/main/resources/plugin/pbc/annal
 * [Zero AI] Zero AI  2. 生成代码......
 * [Zero AI] Zero AI       2.1. backlog日志配置......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/resources/plugin/pbc/annal/infix.xml！
 * [Zero AI] Zero AI       2.2.1. 「默认」集成配置......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/resources/plugin/pbc/integration.json！
 * [Zero AI] Zero AI       2.2.2. 「开发」集成配置......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/resources/plugin/pbc/integration-dev.json！
 * [Zero AI] Zero AI       2.2.3. 「生产」集成配置......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/resources/plugin/pbc/integration-prod.json！
 * [Zero AI] Zero AI       2.2.4. 基础配置......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/resources/plugin/pbc/configuration.json！
 * [Zero AI] Zero AI       2.3.1. 常量处理......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/cv/PbCv.java！
 * [Zero AI] Zero AI       2.3.2. Before/After 插件处理......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/plugin/AbstractPbBefore.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/plugin/AbstractPbAfter.java！
 * [Zero AI] Zero AI       2.3.3. Refine 工具处理......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/refine/PbLog.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/refine/PbPin.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/refine/Pb.java！
 * [Zero AI] Zero AI       2.3.4. Error 异常类处理......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/error/_501PbIoNullException.java！
 * [Zero AI] Zero AI       2.3.5. Component 通道组件......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/component/AbstractPbComponent.java！
 * [Zero AI] Zero AI       2.3.6. In 组件处理......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/input/PbIn.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/input/AbstractPbIn.java！
 * [Zero AI] Zero AI       2.3.7. Out 组件处理......
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/output/PbIo.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/output/AbstractPbIo.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/output/PbIoAdd.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/output/PbIoUpdate.java！
 * [Zero AI] （Sync）成功将数据写入到文件：<工作目录>/src/main/java/cn/originx/pbc/output/PbIoDelete.java！
 * [Zero AI] Zero AI  3. 执行完成......
 * ```
 *
 * @memberOf module:aj
 * @method plugin
 **/