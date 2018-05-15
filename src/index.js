#!/usr/bin/env node
const program = require('commander'),
    co = require('co');
// 工具类
const log = require('./zero/log');
const executor = require('./executor');
const appInfo = require('./../package.json');
program.allowUnknownOption();
program.version(appInfo.version);
log.info(`Zero AI 代码生成器, ` + `https://github.com/silentbalanceyh/vertx-ui`.blue);
log.info(`当前版本: ` + `${appInfo.version}`.red);
log.warn("确认您的Node版本 ( >= 10.x ) 支持ES6.");
log.info("------------------- Zero AI Start ---------------------");

const menus = require(__dirname + "/zero/init.json");
menus.forEach(menu => {
    if (executor && executor.hasOwnProperty(menu.executor)) {
        const cmd = program.command(menu.command)
            .description(menu.description)
            .usage('[options] [value ...]');
        if (menu.options) {
            for (const key in menu.options) {
                if (menu.options.hasOwnProperty(key)) {
                    cmd.option(key, menu.options[key]);
                }
            }
        }
        const fun = executor[menu.executor];
        cmd.action(() => co(fun))
    }
});
program.parse(process.argv);