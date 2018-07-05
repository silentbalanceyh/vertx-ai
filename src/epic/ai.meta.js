const program = require('commander');
const Log = require('./ai.log');

const consoleHeader = () => {
    const appInfo = require('./../../package.json');
    program.allowUnknownOption();
    program.version(appInfo.version);
    Log.info(`Zero AI 代码生成器, ` + 'GitHub : '.bold + `https://github.com/silentbalanceyh/vertx-ui`.blue);
    Log.info(`当前版本: ` + `${appInfo.version}`.red + '  ' + `确认您的Node版本 ( >= 10.x ) 支持ES6.`.yellow);
    Log.info("Zero AI 系统启动......".cyan);
};
module.exports = {
    consoleHeader
};
