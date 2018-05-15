const args = require('../zero/args');
const io = require('../zero/io');
const fs = require("fs");
exports.startMenu = function () {
    const argv = args.parseArgs(4);
    const mockFile = argv['-c'] || argv['--config'];
    if (fs.existsSync(mockFile)) {
        console.info(`[Zero] Start to initialize menus from file: ${mockFile}`);
        const item = fs.lstatSync(mockFile);
        if (!item.isDirectory()) {
            const path = [];
            fs.readFile(mockFile, {}, (err, content) => {
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
                console.info("[Zero] Start to generate entry file UI.js....");
                console.info("[Zero] Read tpl file from shell/tpl/init/UI.js");
                const fromContent = fs.readFileSync("shell/tpl/init/UI.js");
                path.forEach(each => {
                    const folder = each.substring(0, each.lastIndexOf('/'));
                    io.mkdirs(folder);
                    if (!fs.existsSync(each)) {
                        fs.writeFileSync(each, fromContent);
                    }
                });
                console.info("[Zero] Generate files successfully!");
            })
        }
    } else {
        console.error(`[Zero] The path file does not exist: ${mockFile}`)
    }
};