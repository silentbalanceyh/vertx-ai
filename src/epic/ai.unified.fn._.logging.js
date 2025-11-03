const colors = require("colors");
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

const error = (message) => console.error(`[Zero AI Error] `.red.bold + `${message}`.red);
const info = (message) => console.info(`[Zero AI]`.green.bold + ` ${message ? message : ''}`);
const execute = (message) => console.info(`[Zero AI]`.blue.bold + ` ${message ? message : ''}`);
const warn = (message) => console.warn(`[Zero AI]`.yellow.bold + ` ${message}`.yellow);
module.exports = {
    execute,
    info,
    warn,
    error,
};