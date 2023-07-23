const Ec = require('../epic');
const os = require('os');

const os_compatible = ['darwin', 'win32'];

module.exports = () => {
    /*
     * 参数解析
     */
    const actual = Ec.executeInput(
        ['-i', '--input'],
        [
            ["-i", "--input"]
        ]
    );
    /*
     * 基本信息
     */
    const input = actual.input;
    const platform = os.platform();
    Ec.info(`当前操作系统：${platform}`);

    if (os_compatible.indexOf(platform) > -1) {
        const content = Ec.strMD5(input);
        console.info(content);
        Ec.outCopy(content)
            .then(sign => Ec.info(`加密的字符串已经成功拷贝到剪切板中！`))
    } else {
        /*
         * 不支持的操作系统
         */
        Ec.fxError(10032, platform);
    }
};


/**
 * ## `ai md5`
 *
 * ### 1. 命令
 *
 * ```shell
 * ai md5 -i <Input>
 * ```
 *
 * |短参|全参|类型|默认|含义|
 * |---|---|---|---|:---|
 * |-i|--input|String|无|输入需要MD5加密的原始字符串。|
 *
 * ### 2. 介绍
 *
 * 使用该命令加密输入字符串，如果平台支持还会拷贝到剪切板中，目前支持的操作系统：
 *
 * * `darwin`：MacOs苹果操作系统
 *
 * ### 3. 执行
 *
 * ```shell
 * ai md5 -i smaveapp                                                                                                                                                                                                                                                 lang@LangYus-MacBook-Pro
 * [Zero AI] Zero AI 代码生成工具  : <标准工具>
 * [Zero AI] HomePage   : http://www.vertxai.cn
 * [Zero AI] Github     : https://github.com/silentbalanceyh/vertx-ai.git
 * [Zero AI] Version    : 0.3.19  「确认您的Node版本 ( >= 14.x ) 支持ES6, ES7.」
 * [Zero AI] Zero AI 系统启动......
 * [Zero AI] Zero AI 加载输入参数：
 * {
 *     "input": "smaveapp"
 * }
 * [Zero AI] 当前操作系统：darwin
 * 443196C59BF602102141607D992702EE
 * [Zero AI] 加密的字符串已经成功拷贝到剪切板中！
 * ```
 *
 * @memberOf module:ai
 * @method md5
 */