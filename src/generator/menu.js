const ai = require('../zero/zero');
const {args, log, io, config} = ai;
const fs = require("fs");
exports.startMenu = function () {
    const argv = args.parseArgs(4);
    const inputFile = argv['-c'] || argv['--config'];
    const inputFolder = argv['-f'] || argv['--folder'];
    config.execFileExist(inputFile, (configFile) => {
        log.info(`从配置文件初始化组件，配置文件路径: ${configFile}.`);
        const item = fs.lstatSync(configFile);
        if (!item.isDirectory()) {
            const path = [];
            fs.readFile(configFile, {}, (err, content) => {
                if (!err) {
                    const json = JSON.parse(content);
                    if (json.data && 0 < json.data.length) {
                        json.data.forEach(each => {
                            if (each['uri']) {
                                // Zero规范主页
                                path.push(`src/components${each['uri']}/UI.js`);
                            }
                        })
                    }
                }
                // 回调中处理Path
                log.info("开始生成入口文件 UI.js....");
                log.info("读取模板文件 ./tpl/init/UI.js");
                log.info("生成入口代码：".blue);
                const fromContent = fs.readFileSync(__dirname + "/tpl/menu/UI.zt");
                path.forEach(each => {
                    const folder = each.substring(0, each.lastIndexOf('/'));
                    const target = inputFolder + '/' + folder;
                    io.dirsMake(target);
                    if (!fs.existsSync(each)) {
                        log.info(each);
                        fs.writeFileSync(each, fromContent);
                    }
                });
                // 读取targetPath中的最后一个路径，生成namespace
                log.info("生成名空间链接器：".blue);
                path.forEach(path => {
                    const targetPath = io.dirTree(path.split('/'));
                    let ns = null;
                    for (let idx = targetPath.length - 1; idx >= 0; idx--) {
                        const file = targetPath[idx];
                        if (fs.existsSync(file)) {
                            const stat = fs.statSync(file);
                            if (stat.isDirectory()) {
                                ns = file;
                                break;
                            }
                        }
                    }
                    const nsData = {};
                    nsData['ns'] = ns.replace(/src\//g, "");
                    const targetNs = ns + "/Cab.json";
                    if (!fs.existsSync(targetNs)) {
                        log.info(targetNs);
                        fs.writeFileSync(targetNs, JSON.stringify(nsData));
                    }
                });
                log.info("Successfully!".blue + " 生成成功！");
            })
        }
    });
};