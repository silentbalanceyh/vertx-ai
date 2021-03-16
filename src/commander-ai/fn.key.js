const Ec = require('../epic');
const U = require('underscore');

const applyEach = (data = {}, field = 'key') => {
    if (U.isArray(data)) {
        data.forEach(element => {
            if ("object" === typeof element) {
                applyEach(element, field);
            }
        })
    } else {
        Ec.itObject(data, (key, value) => {
            if ("object" === typeof value) {
                applyEach(value, field);
            }
        })
        if (!data[field]) {
            data[field] = Ec.strUuid();
        }
    }
};
module.exports = () => {
    const actual = Ec.executeInput(
        [
            ['-p', '--path']
        ],
        [
            ['-p', '--path'],
            ['-f', '--field', 'key']
        ]
    );

    Ec.cxExist(actual.path);
    Ec.itFileSync(actual.path, (item) => {
        // 读取基础数据信息
        const content = Ec.ioString(item);
        // 顶层引用
        const rootRef = JSON.parse(content);
        applyEach(rootRef, actual.field);
        // 路径替换
        Ec.outJson(item, rootRef);
    });
}

/**
 * ## `ai key`
 *
 * ### 1. 命令
 *
 * 使用该命令针对数据中的所有节点追加`field = key`的UUID值。
 *
 * ### 2. 执行
 *
 * ```shell
 * # 2.1. 命令语法
 * ai key -p <path>
 *
 * # 2.2. 执行测试
 * ai key -p key
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "path": "key",
 *      "field": "key"
 * }
 * [Zero AI] （Async）成功将数据写入到文件：key/key2.json！
 * [Zero AI] （Async）成功将数据写入到文件：key/key3.json！
 * [Zero AI] （Async）成功将数据写入到文件：key/key1.json！
 * ```
 *
 * ### 3. 选项
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|（无）|「统一格式」数据文件路径。|
 * |-f|--field|String|key|追加的UUID的字段名。|
 *
 * @memberOf module:ai
 * @method key
 */