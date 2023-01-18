const Io = require('./ai.export.interface.io');

const seekResource = (path = ".") => {
    const parent = Io.dirParentPom(path);
    console.log(parent);
}

module.exports = {
    seekResource,
}