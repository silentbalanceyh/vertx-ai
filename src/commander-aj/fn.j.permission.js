const Ec = require('../epic');
const path = require('path');

module.exports = () => {
    const actual = Ec.executeInput(
        [
            ["-r", "--role"],
            ["-o", "--out"]
        ],
        [
            ["-r", "--role"],
            ["-o", "--out"],
            ["-i", "--input"]
        ]
    );
    // 读取文件列表
    const standard = Ec.ioFiles(path.join(__dirname, `../cab/perm`));
    const configuration = {};
    configuration.files = standard.map(item => item.path);
    if (actual.input) {
        let filesInput = Ec.ioFiles(path.join(process.cwd(), actual.input));
        configuration.filesInput = filesInput.map(item => item.path);
    }
    configuration.role = actual.role;
    configuration.out = actual.out;
    Ec.excelRun(configuration);
}
/**
 * ## `aj perm`
 *
 * ### 1. 命令
 *
 * 使用该命令生成某个角色的专用权限文件目录（内置所有Zero Extension标准权限），此命令会直接从单个角色中拷贝
 *
 * ### 2. 执行
 *
 * #### 2.1. 基本介绍
 *
 * ```shell
 * # 2.1.1. 命令语法
 * aj perm -r <role> -i <input>
 *
 * # 2.1.2. 执行测试
 * ai perm -r ccc -i input
 *
 * [Zero AI] Zero AI  1. 准备生成角色对应权限：ID = "ccc" ...
 * [Zero AI] Zero AI  2. 生成 Zero Extension 权限...
 * ```
 *
 * ### 3. 选项
 *
 * #### 3.1. 基本说明
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-c|--role|String|无|系统中角色的UUID。|
 * |-i|--input|String|无|另外一个目录，用来合并新权限。|
 *
 * @memberOf module:aj
 * @method perm
 **/