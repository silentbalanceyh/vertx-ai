const Ec = require('../epic');
module.exports = () => {
    const actual = Ec.executeInput(
        [
            ['-p', '--path'],
            ['-f', '--field']
        ],
        [
            ['-p', '--path'],
            ['-f', '--field']
        ]
    );
    const inputData = Ec.ioDataA(actual.path);
    const field = actual.field;
    if (field) {
        const fieldArr = field.toString().split(',');
        Ec.info(`检查字段：${JSON.stringify(fieldArr).blue}`);
        fieldArr.forEach(field => {
            const checked = {};
            inputData.forEach(each => {
                const value = each[field];
                if (value && checked.hasOwnProperty(value)) {
                    Ec.info(`字段出现重复值：${field} = ${value}`.red);
                }
                checked[value] = true;
            });
        })
        Ec.info("系统检查重复值完成！".cyan);
    } else {
        Ec.fxError(10001, field, "String");
    }
}

/**
 * ## `ai uk`
 *
 * ### 1. 命令
 *
 * 使用该命令检查数据文件中的数据是否包含重复属性`field = value`键值对。
 *
 * ### 2. 执行
 *
 * ```shell
 * # 2.1. 命令语法
 * ai uk -p <path> -f <field>
 *
 * # 2.2. 执行测试
 * ai uk -p uk.json -f name
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "path": "uk.json",
 *      "field": "name"
 * }
 * [Zero AI] 检查字段：["name"]
 * [Zero AI] 字段出现重复值：name = Lang2
 * [Zero AI] 系统检查重复值完成！
 * ```
 *
 * ### 3. 选项
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|（无）|「统一格式」数据文件路径。|
 * |-f|--field|String|（无）|待检查的字段名，字段可使用`field1,field2,field3`格式检查多个字段。|
 *
 * @memberOf module:ai
 * @method uk
 */