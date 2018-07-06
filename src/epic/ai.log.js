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

const error = (message) => console.error(`[Zero AI] `.red.bold + `ERR : ${message}`.red);
const info = (message) => console.warn(`[Zero AI]`.green.bold + ` ${message}`);
const warn = (message) => console.warn(`[Zero AI]`.yellow.bold + ` ${message}`.yellow);
module.exports = {
    info,
    warn,
    error
};