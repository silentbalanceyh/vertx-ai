const Ec = require('../epic');
module.exports = () => {
    const actual = Ec.executeInput(
        ['-p', '--path'],
        [
            ['-p', '--path'],
            ['-c', '--config', null],
            ['-s', '--separator', ',']
        ]
    );
    const inputData = Ec.ioDataA(actual.path);
    let mapping = Ec.fxContinue(Ec.isExist(actual.config), () => Ec.parseZero(actual.config));
    // Csv
    Ec.info(`映射配置数据：\n${JSON.stringify(mapping, null, 4)}`)
    Ec.info(`使用分隔符：${actual.separator.green}`);
    const csvArr = Ec.toCsv(inputData, mapping, actual.separator);
    const csvData = csvArr.join('\n');
    Ec.outString('.' + Ec.SEPARATOR + Ec.strUuid() + ".csv", csvData);
};

/**
 * ## `ai csv`
 *
 * ### 1. 命令
 *
 * 使用该命令将读取的Array数组数据转换成csv的文件格式
 *
 * ### 2. 执行
 *
 * ```shell
 * # 2.1. 命令语法
 * ai csv -p <path>
 *
 * # 2.2. 执行测试
 * ai csv -p csv.json
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *      "path": "csv.json",
 *      "config": null,
 *      "separator": ","
 * }
 * [Zero AI] 使用分隔符：,
 * [Zero AI] （Async）成功将数据写入到文件：./9bfe660a-d1be-48af-914f-97d996278086.csv！
 * ```
 *
 * 输出的格式如下
 *
 * ```csv
 * name,email
 * Lang1,lang.yu1@hpe.com
 * Lang2,lang.yu2@hpe.com
 * ```
 *
 * ### 3. 选项
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-p|--path|String|（无）|「统一格式」数据文件路径。|
 * |-c|--config|String|null|配置文件路径。|
 * |-s|--separator|String|`,`|Csv文件的分隔符设置。|
 *
 * ### 4. 特殊说明
 *
 * #### 4.1. 数据文件格式
 *
 * 「通用（略）」数据部分必须对等，从第一个元素开始执行所有的字段解析，如果字段不匹配则直接跳过。
 *
 * #### 4.2. 带mapping配置文件
 *
 * **csv.zero**
 *
 * ```shell
 * # KV; 为文件前缀
 * KV;
 * name=Name,email=Email
 * ```
 *
 * **多余的输出**
 *
 * ```shell
 * .......
 * [Zero AI] 映射配置数据：
 * {
 *      "name": "Name",
 *      "email": "Email"
 * }
 * [Zero AI] 使用分隔符：,
 * [Zero AI] 字段执行转换：name -> Name
 * [Zero AI] 字段执行转换：email -> Email
 * .......
 * ```
 *
 * **最终数据**
 *
 * ```csv
 * Name,Email
 * Lang1,lang.yu1@hpe.com
 * Lang2,lang.yu2@hpe.com
 * ```
 *
 * @memberOf module:ai
 * @method csv
 */