#!/usr/bin/env node
const Ux = require('./epic');
const Executor = require('./commander-aj');
Ux.executeHeader("<专用工具>");
// 读取配置文件
let configArr = Ux.zeroParse(__dirname + '/commander/aj.zero');
configArr = Ux.itArray(configArr, (config) => Ux.itCompress(config, "option"));
// Commander的执行
Ux.executeBody(configArr, Executor);
// 解析参数专用
Ux.executeEnd();