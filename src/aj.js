#!/usr/bin/env node
const Ux = require('./epic');
Ux.consoleHeader();
// 读取配置文件
const argument = Ux.zeroParse(__dirname + '/datum/argument.zero');
const config = Ux.zeroParse(__dirname + '/datum/commander.zero');
console.info(config);