#!/usr/bin/env node
const Ec = require('./epic');
const Executor = require('./commander-ai');
Ec.executeHeader("<标准工具>");
// 读取配置文件
let configArr = Ec.parseZero(__dirname + '/commander/ai.zero');
configArr = Ec.itArray(configArr, (config) => Ec.itCompress(config, "option"));
// Commander的执行
Ec.executeBody(configArr, Executor);
// 解析参数专用
Ec.executeEnd();