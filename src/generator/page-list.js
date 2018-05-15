const ai = require('../zero/zero');
const {args, log, io, config} = ai;
const fs = require("fs");
exports.createPlist = function () {
    const argv = args.parseArgs(2);
    const inputFile = argv['-c'] || argv['--config'];
    const inputPath = `${__dirname}/.zero/module/${inputFile}`;
    config.execFileExist(inputPath, (configPath) => {
        console.info(configPath);
    })
};