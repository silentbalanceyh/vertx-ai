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

const error = (message) => console.log(`[Zero AI]`.green.bold + ` ${message}`.red);
const info = (message) => console.log(`[Zero AI]`.green.bold + ` ${message}`);
const warn = (message) => console.log(`[Zero AI]`.green.bold + ` ${message}`.yellow);
module.exports = {
    info,
    warn,
    error
};