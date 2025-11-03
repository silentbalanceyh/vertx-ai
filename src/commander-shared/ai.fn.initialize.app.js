const fs = require("fs");
const Ec = require("../epic");
const IoUt = require("./ai.fn.initialize.__.io.util");
const {config} = require("exceljs");

const initAppConfiguration = (parsed = {}) => {
    const name = parsed.name;
    const configuration = IoUt.ioConfiguration(parsed, name);
    const appName = IoUt.ioAppName(name);
    configuration.srcPackage = `io.zerows.apps.zero.${appName}`;
    configuration.srcId = appName;
    configuration.srcType = Symbol("APP");

    configuration.dbName = "DB_ZERO_" + appName.toUpperCase();
    configuration.dbUser = appName;
    configuration.dbPassword = appName;
    return configuration;
}
const initApp = async (configuration = {}) => {
    console.log(configuration);
    return null;
}
module.exports = {
    initApp,
    initAppConfiguration
}