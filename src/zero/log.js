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
module.exports = {
    info: (message) => console.log(`[Zero AI]`.green.bold + ` ${message}`),
    warn: (message) => console.log(`[Zero AI]`.green.bold + ` ${message}`.yellow),
    error: (message) => console.log(`[Zero AI]`.green.bold + ` ${message}`.red)
};