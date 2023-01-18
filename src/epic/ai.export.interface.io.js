const __IS = require('./ai.unified.fn.is.decision');
const __TO = require('./ai.uncork.fn.to.typed');
const __OUT = require("./ai.path.fn.out.content");

const __IO_CMD = require("./ai.path.fn.io.command");
const __IO_SPEC = require('./ai.path.fn.io.specification');
const __IO_TYPED = require('./ai.path.fn.io.typed');

const __DIR = require("./ai.path.fn.dir.operation");

const __IO = {
    ...__IO_CMD,
    ...__IO_TYPED,
    ...__IO_SPEC,
}
module.exports = {

    // interface.
    /*
       dirChildren,
       dirParent,
       dirTree,
       dirCreate,
       dirResolve,
     */
    ...__DIR,
    // interface.
    /*
       ioCopy,
       ioDelete,

       ioJArray,
       ioJObject,
       ioString,
       ioStream,
       ioCsv,
       ioProp,
       ioFiles,

       ioName,
       ioRoot,
       ioDataA,
       ioSwitch,
     */
    ...__IO,

    // interface.
    /*
       outJson,
       outString,
       outCopy,
     */
    ...__OUT,
    // interface.
    /*
       toTable,
       toJObject,
       toJArray,
       toCsv,
     */
    ...__TO,
    // interface.
    /*
       isFile,
       isDirectory,
       isExist
     */
    ...__IS,
};