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
        console.info(log.error(`Arguments missing, expected: ${ensure / 2} argument.`))
    }
};
module.exports = {
    parseArgs
};