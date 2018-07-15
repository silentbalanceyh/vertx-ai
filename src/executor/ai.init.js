const Ux = require('../epic');
const shell = require('child_process');
const initZero = () => {
    const actual = Ux.executeInput(
        [],
        [
            ['-o', '--out', '.']
        ]
    );

    Ux.cxExist(actual['out']);
    Ux.cxEmpty(actual['out']);

    shell.exec(`git clone https://github.com/silentbalanceyh/vertx-ui ${actual['out']}`, (error, stdout, stderr) => {
        if (error) {
            console.error('exec error: ' + error);
            return
        }
        Ux.info('初始化项目：' + stderr.toString().cyan);
        // 后期处理
        Ux.deletePath(actual['out'] + `/CNAME`);
        Ux.deletePath(actual['out'] + `/LICENSE`);
        Ux.deletePath(actual['out'] + `/_config.yml`);
        Ux.deletePath(actual['out'] + `/yarn.lock`);
        Ux.deletePath(actual['out'] + `/.git`);
        // 读取资源文件写入到目录中
        Ux.info(('初始化完成，项目地址：' + actual['out']).cyan);
    })
};
module.exports = {
    initZero
};