const fs = require("fs");
const __LOG = require("./ai.unified.fn._.logging");
const __FX = require("./ai.under.fn.fx.terminal");
const __IO = require('./ai.path.fn.io.typed');
const __IS = require("./ai.unified.fn.is.decision");
const __OUT = require("./ai.path.fn.out.content");
const __V = require("./zero.__.v.constant");

const __ioDeleteDir = (path) => {
    if (fs.existsSync(path)) {
        const etat = fs.statSync(path);
        if (etat.isDirectory()) {
            const children = fs.readdirSync(path);
            if (0 === children.length) {
                fs.rmdirSync(path);
            } else {
                children.forEach(item => {
                    const hitted = path + __V.FILE_DELIMITER + item;
                    __ioDeleteDir(hitted);
                });
            }
        } else {
            __LOG.info(`删除文件：${path}`);
            fs.unlinkSync(path);
        }
    }
};

const ioCopy = (from, to) => {
    __FX.fxContinue(__IS.isExist(from) && !__IS.isExist(to) && __IS.isFile(from), () => {
        const content = __IO.ioString(from);
        __OUT.outString(to, content);
    });
};

const ioDelete = (path) => {
    __FX.fxError(__V.FILE_DELIMITER === path.trim(), 10024, path);
    __ioDeleteDir(path);
};
module.exports = {
    ioCopy,
    ioDelete,
}