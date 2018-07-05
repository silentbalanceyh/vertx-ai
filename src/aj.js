#!/usr/bin/env node
const Ux = require('./epic');
Ux.consoleHeader();
// 读取配置文件
let configArr = Ux.zeroParse(__dirname + '/datum/commander.zero');
configArr = Ux.itArray(configArr, (config) => Ux.itCompress(config, "option"));
// commander专用处理
configArr.map(item => console.info(item.options));