const Ec = require('../epic');
const os = require('os');

module.exports = () => {
    /*
     * 参数解析
     */
    const actual = Ec.executeInput(
        [],
        [
            ['-n', '--number', 1],
            ['-l', '--length', 64]
        ]
    );
    /*
     * 基本信息
     */
    const number = actual.number;
    const length = actual.length;
    const platform = os.platform();
    Ec.info(`随机字符串，生成数量：${number}，长度：${length}`);
    Ec.info(`当前操作系统：${platform}`);

    if ("darwin" === platform) {
        const content = [];
        for (let idx = 0; idx < number; idx++) {
            const generated = Ec.strRandom(length);
            console.info(generated);
            content.push(generated);
        }
        Ec.outCopy(content.join('\n'))
            .then(sign => Ec.info(`生成的随机字符串已经全部成功拷贝到剪切板中！`))
    } else {
        /*
         * 不支持的操作系统
         */
        Ec.fxError(10032, platform);
    }
};


/**
 * ## `ai str`
 *
 * ### 1. 命令
 *
 * ```shell
 * ai str -n <N> -l <N>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-n|--number|Number|1|指定需要生成随机字符串的数量，默认生成1个随机字符串值，`\n`符号分割。|
 * |-l|--length|Number|64|指定随机字符串长度，默认长度64。|
 *
 * ### 2. 执行
 *
 * 使用该命令生成指定数量的随机字符串，如果平台支持还会拷贝到剪切板中，目前支持的操作系统：
 *
 * * `darwin`：MacOs苹果操作系统
 *
 * ### 3. 执行
 *
 * ```shell
 * ai str                                                                                                                                                                                                                                                  lang@LangYus-MacBook-Pro
 * [Zero AI] Zero AI 代码生成工具  : <标准工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.5  「确认您的Node版本 ( >= 14.x ) 支持ES6, ES7.」
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *    "number": 1,
 *    "length": 64
 * }
 * [Zero AI] 随机字符串，生成数量：1，长度：64
 * [Zero AI] 当前操作系统：darwin
 * 5lTe8OsBsi8bw6PbVlS0aftyAfjsmEGjiwXXWpL5IEM3px6ZiM8Vz2nKnnqHFDnv
 * [Zero AI] 生成的随机字符串已经全部成功拷贝到剪切板中！
 * ```
 *
 * @memberOf module:ai
 * @method str
 */