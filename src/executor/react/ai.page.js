const Ux = require('../../epic');
const initPage = () => {
    const actual = Ux.executeInput(
        [
            "-u", "--ui"
        ],
        [
            ['-u', '--ui', '.'],
            ['-m', '--module', "UI,Op"]
        ]
    );
    const config = Ux.reactComponentRoot(actual, "UI");
    const files = Ux.reactFileAnalyze(actual.module, config);
    const tpl = Ux.reactTpl(__dirname);
    // 1.模块处理
    const mod = {};
    {
        const last = actual['ui'].lastIndexOf('.');
        let moduleName = actual['ui'].substring(last + 1).split('-');
        const modules = [];
        moduleName.forEach(module => {
            if ("string" === typeof module) {
                modules.push(module.substring(0, 1).toUpperCase() + module.substring(1));
            }
        });
        mod.MOD = modules.join('');
        mod.MODUP = modules.join('/').toUpperCase();
    }
    // 2.模板处理
    const formatedTpl = {};
    {
        Ux.itObject(tpl, (key, value) => {
            value = value.replace(/#MOD#/g, mod.MOD);
            value = value.replace(/#MODUP#/g, mod.MODUP);
            formatedTpl[key] = value;
        })
    }
    // 3.文件替换
    {
        Ux.itObject(files, (key, path) => {
            // 3.1.写Cab.less
            if ("Cab.less" === key && tpl[key]) {
                Ux.outString(path, tpl[key]);
            }
            // 3.2.写Cab.json
            if ("Cab.json" === key) {
                const ns = {};
                ns.ns = config.namespace;
                Ux.outJson(path, ns);
            }
            // 3.3.书写Act
            if (key.startsWith("Act")) {
                const content = formatedTpl[key];
                Ux.outString(path, content);
            }
            // 3.4.书写UI
            if (key.startsWith("UI")) {
                if (key.endsWith("js")) {
                    const name = key.substring(0, key.lastIndexOf('.'));
                    let content = formatedTpl["UI.js"];
                    content = content.replace(/#NAME#/g, name);
                    Ux.outString(path, content);
                } else {
                    // 分析专用
                    const content = {};
                    if (0 < key.indexOf("Form")) {
                        content['_form'] = {
                            ui: [[]]
                        }
                    } else if ("UI.json" === key) {
                        content['_topbar'] = {
                            title: ""
                        }
                    }
                    Ux.outJson(path, content);
                }
            }
        })
    }
    // 4.Op处理
    {
        const fnFilter = each => each.startsWith("Op");
        const isSingle = 1 === Object.keys(files)
            .filter(fnFilter).length;
        if (isSingle) {
            const content = Ux.reactOp();
            Ux.outString(files['Op.ts'], content);
        } else {
            Ux.itObject(files, (key, path) => {
                if (key.startsWith("Op")) {
                    if ("Op.ts" !== key) {
                        const content = Ux.reactOp();
                        Ux.outString(path, content);
                    }
                }
            });
            const fnChild = each => fnFilter(each) && "Op.ts" !== each;
            const children = Object.keys(files).filter(fnChild);
            // 写入Op.ts
            const content = Ux.reactOp(children);
            Ux.outString(files["Op.ts"], content);
        }
    }
};
module.exports = {
    initPage
};