const Ec = require('../epic');
const os = require('os');
const {v4} = require("uuid");

function copyMacOs(data) {
    return new Promise(function (resolve, reject) {
        const proc = require('child_process').spawn('pbcopy');
        proc.on('error', function (err) {
            reject(err);
        });
        proc.on('close', function (err) {
            resolve();
        });
        proc.stdin.write(data);
        proc.stdin.end();
    })
}

/**
 * ## `ai uuid`
 *
 * ### 1. 命令
 *
 * 使用该命令生成指定数量的UUID字符串，如果平台支持还会拷贝到剪切板中，目前支持的操作系统：
 *
 * * `darwin`：MacOs苹果操作系统
 *
 * ### 2. 执行
 *
 * ```shell
 * # 2.1. 命令语法
 * ai uuid -n <N>
 *
 * # 2.2. 执行测试
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
 * ### 3. 选项
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-n|--number|Number|20|指定需要生成UUID值的数量，默认生成20个UUID字符串值，`\n`符号分割。|
 *
 * @memberOf module:ai
 * @method uuid
 */
module.exports = () => {
    const actual = Ec.executeInput(
        [],
        [
            ['-n', '--number', 20]
        ]
    );
    const number = actual.number;
    Ec.info(`UUID生成器，生成数量：${number}`);
    const platform = os.platform();
    Ec.info(`当前操作系统：${platform}`);
    if ("darwin" === platform) {
        const content = [];
        for (let idx = 0; idx < number; idx++) {
            const generated = v4();
            console.info(generated);
            content.push(generated);
        }
        copyMacOs(content.join('\n'))
            .then(sign => Ec.info(`生成的UUID已经全部成功拷贝到剪切板中！`))
    } else {
        Ec.fxError(10032, platform);
    }
};