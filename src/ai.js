#!/usr/bin/env node
const Ec = require('./epic');
const Ut = require('./commander-shared');
const Executor = require('./commander-ai');


// 输出头部
Ec.executeHeader("Rachel Momo Command");


// 读取配置文件
const configArr = Ut.parseMetadata();
Ec.executeBody(configArr, Executor);


// 输出尾部
Ec.executeEnd();