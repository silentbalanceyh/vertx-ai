const __IS = require('./ai.unified.fn.is.decision');
const __TO = require('./ai.unbind.fn.to.typed');
const __OUT = require("./ai.unbind.fn.out.content");

const __IO_CMD = require("./ai.unbind.fn.io.command");
const __IO_SPEC = require('./ai.unbind.fn.io.specification');
const __IO_TYPED = require('./ai.unbind.fn.io.typed');

const __DIR = require("./ai.unbind.fn.dir.operation");

const __IO = {
    ...__IO_CMD,
    ...__IO_TYPED,
    ...__IO_SPEC,
}

// ----------- 新版 dir -----------
const dirResolve = (path = "") => __DIR.dirResolve(path);
const dirParentPom = (path = ".") => __DIR.dirParentPom(path);
const dirParent = (path, includeCurrent = false) => __DIR.dirParent(path, includeCurrent);
const dirChildren = (path, includeCurrent = true) => __DIR.dirChildren(path, includeCurrent);

const dirCreate = (path = "") => __DIR.dirCreate(path);

// ----------- 新版 out -----------
const outJson = (paths, content, sync = false) =>
    __OUT.outJson(paths, content, sync);
const outString = (paths, content, sync = false) =>
    __OUT.outString(paths, content, sync);
const outCopy = (data) => __OUT.outCopy(data);
// ----------- 新版 io -----------
// command
const ioCopy = (from, to) => __IO.ioCopy(from, to);
const ioDelete = (path) => __IO.ioDelete(path);
// typed
const ioJObject = (path) => __IO.ioJObject(path);
const ioJArray = (path) => __IO.ioJArray(path);
const ioString = (path) => __IO.ioString(path);
const ioStream = (path) => __IO.ioStream(path);
const ioProp = (path) => __IO.ioProp(path);
const ioFiles = (folder) => __IO.ioFiles(folder);
const ioCsv = (file, separator) => __IO.ioCsv(file, separator);
// spec
const ioRoot = () => __IO.ioRoot();
const ioName = (path = '.') => __IO.ioName(path);
const ioDataA = (path) => __IO.ioDataA(path);
// ----------- 新版 to -----------
const toTable = (record = {}) => __TO.toTable(record);
const toJObject = (content = "") => __TO.toJObject(content);
const toCsv = (array = [], mapping = {}, delimiter) => __TO.toCsv(array, mapping, delimiter);
const toJArray = (content = "") => __TO.toJArray(content);

// ----------- 新版 is -----------
const isFile = (path) => __IS.isFile(path);
const isDirectory = (path) => __IS.isDirectory(path);
const isExist = (path) => __IS.isExist(path);
module.exports = {

    // interface.
    dirChildren,
    dirParent,
    dirParentPom,
    dirCreate,
    dirResolve,

    // interface.
    ioCopy,
    ioDelete,

    // interface.
    outJson,
    outString,
    outCopy,

    // interface.
    ioJArray,
    ioJObject,
    ioString,
    ioStream,
    ioCsv,
    ioProp,
    ioFiles,
    // interface.
    ioName,
    ioRoot,
    ioDataA,
    // interface.
    toTable,
    toJObject,
    toJArray,
    toCsv,
    // interface.
    isFile,
    isDirectory,
    isExist
};