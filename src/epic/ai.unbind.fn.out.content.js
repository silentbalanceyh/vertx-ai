const fs = require('fs');
const os = require("os");

const __LOG = require("./ai.unified.fn._.logging");
const __FX = require("./ai.under.fn.fx.terminal");

const __outFile = (paths, content, sync) => {
    if (sync) {
        fs.writeFileSync(paths, content);
        __LOG.info(`（Sync）成功将数据写入到文件：${paths.cyan}！`);
    } else {
        fs.writeFile(paths, content, (res) => {
            __LOG.info(`（Async）成功将数据写入到文件：${paths.cyan}！`);
        });
    }
};

const outJson = (paths, content, sync = false) => __FX.fxContinue(!!content, () => __outFile(paths, JSON.stringify(content, null, 4), sync));
const outString = (paths, content, sync = false) => __FX.fxContinue(!!content, () => __outFile(paths, content, sync));


const outCopy = (data) => new Promise(function (resolve, reject) {
    const platform = os.platform();
    let cmd = '';
    if (os.platform() === 'win32') {
        cmd = 'clip';
    } else if (os.platform() === 'darwin') {
        cmd = 'pbcopy';
    } else {
        __FX.fxError(10032, platform);
    }

    const proc = require('child_process').spawn(cmd);
    proc.on('error', function (err) {
        reject(err);
    });
    proc.on('close', function (err) {
        resolve();
    });
    proc.stdin.write(data);
    proc.stdin.end();
});
module.exports = {
    outCopy,
    outString,
    outJson,
}