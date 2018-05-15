const log = require('./log');
const parseArgs = (ensure) => {
    const arguments = process.argv.splice(3);
    if (ensure === arguments.length) {
        const config = {};
        let key = undefined;
        let value = undefined;
        for (let idx = 0; idx <= arguments.length; idx++) {
            if (0 === idx % 2) {
                key = arguments[idx];
            } else {
                value = arguments[idx];
            }
            if (key && value) {
                config[key] = value;
                key = undefined;
                value = undefined;
            }
        }
        return config;
    } else {
        log.error(`参数丢失，期望参数: ${ensure / 2} 个.`);
        process.exit();
    }
};
module.exports = {
    parseArgs
};