const Ec = require('../epic');
const os = require('os');

const os_compatible = ['darwin', 'win32'];

module.exports = () => {
    /*
     * 参数解析
     */
    const actual = Ec.executeInput(
        [],
        [
            ['-n', '--number', 20]
        ]
    );
    /*
     * 基本信息
     */
    const number = actual.number;
    const platform = os.platform();
    Ec.info(`UUID生成器，生成数量：${number}`);
    Ec.info(`当前操作系统：${platform}`);
    if (os_compatible.indexOf(platform) > -1) {
        const content = [];
        for (let idx = 0; idx < number; idx++) {
            const generated = Ec.strUuid();
            console.info(generated);
            content.push(generated);
        }
        Ec.outCopy(content.join('\n'))
            .then(sign => Ec.info(`生成的UUID已经全部成功拷贝到剪切板中！`))
    } else {
        /*
         * 不支持的操作系统
         */
        Ec.fxError(10032, platform);
    }
};


/**
 * ## `ai uuid`
 *
 * ### 1. 命令
 *
 * ```shell
 * ai uuid -n <N>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-n|--number|Number|20|指定需要生成UUID值的数量，默认生成20个UUID字符串值，`\n`符号分割。|
 *
 * ### 2. 介绍
 *
 * 使用该命令生成指定数量的UUID字符串，如果平台支持还会拷贝到剪切板中，目前支持的操作系统：
 *
 * * `darwin`：MacOs苹果操作系统
 *
 * ### 3. 执行
 *
 * ```shell
 * ai uuid -n 3
 * # ...省略部分...
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] 命令参数：
 * {
 *      "number": "3"
 * }
 * [Zero AI] UUID生成器，生成数量：3
 * [Zero AI] 当前操作系统：darwin
 * 14ea44ed-5d9a-406a-9912-d95d8f6a8411
 * 5d27ca30-3e74-4a8a-a149-e8d40677d542
 * a1ddb2ce-eabf-4a95-968d-8e4655207f44
 * [Zero AI] 生成的UUID已经全部成功拷贝到剪切板中！
 * ```
 *
 * @memberOf module:ai
 * @method uuid
 */