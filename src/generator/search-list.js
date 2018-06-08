const ai = require('../zero/zero');
const {args, log, io, config} = ai;
const fs = require("fs");
const Grid = require('./model/grid');

const getFilterJson = (module = {}, cab = "") => {
    const moduleTpl = fs.readFileSync(cab + '/UI.Filter.zt', 'utf-8');
    const fieldTpl = cab + '/UI.Filter.Field.zt';
    // 遍历字段
    const content = [];
    config.eachField(module, (field) => {
        if (field.isFilter) {
            const lineTpl = fs.readFileSync(fieldTpl, "utf-8");
            const lineCtx = lineTpl.replace(/#NAME#/g, field.name).replace(/#DISPLAY#/g, field.display);
            content.push(JSON.parse(lineCtx));
        }
    });
    content.push({field: "$button"});
    const grid = new Grid(3, content);
    return moduleTpl.replace(/#ROW#/g, JSON.stringify(grid.matrix));
};

const getListJson = (module = {}, cab = "") => {
    const moduleTpl = fs.readFileSync(cab + "/UI.List.zt", "utf-8");
    const columnTpl = cab + '/UI.List.Column.zt';
    // 遍历字段
    const content = [];
    const condition = {};
    config.eachField(module, (field) => {
        if (field.isColumn) {
            const colTpl = fs.readFileSync(columnTpl, "utf-8");
            const colData = colTpl.replace(/#NAME#/g, field.name).replace(/#DISPLAY#/g, field.display);
            let col = JSON.parse(colData);
            // 是否排序
            if (field.config['sorter']) {
                col['sorter'] = field.config['sorter'];
            }
            // 文件合并
            if (field.config['file']) {
                const data = JSON.parse(fs.readFileSync(cab + '/tpl/' + field.config['file'] + '.json'));
                Object.assign(col, data);
            }
            content.push(col);
            // 是否过滤
            if (field.config['filter']) {
                condition[field.name] = field.config['filter'];
            }
        }
    });
    const rest = module.code.toLocaleLowerCase();
    const moduleName = module.name;
    let columns = JSON.stringify(content);
    columns = columns.substring(1, columns.length - 1);
    return moduleTpl
        .replace(/#REST#/g, rest)
        .replace(/#MODULE#/g, moduleName)
        .replace(/#COLUMN#/g, columns)
        .replace(/#COND#/g, JSON.stringify(condition));
};

const getFormJson = (module = {}, cab = "") => {
    const moduleTpl = fs.readFileSync(cab + "/UI.Form.zt", "utf-8");
    const fieldTpl = cab + '/UI.Form.Field.zt';
    const content = [];
    const rules = module.rules;
    config.eachField(module, (field) => {
        if (field.isField) {
            const colTpl = fs.readFileSync(fieldTpl, "utf-8");
            const colData = colTpl.replace(/#NAME#/g, field.name).replace(/#DISPLAY#/g, field.display);
            const fieldObj = JSON.parse(colData);
            // prop处理
            if (field.config['prop']) {
                fieldObj['optionConfig'].valuePropName = field.config['prop'];
            }
            // 验证处理，包含了验证
            if (rules[field.name]) {
                const ruleConfig = rules[field.name].split(',');
                const rulesCfg = [];
                ruleConfig.forEach(each => {
                    each = each.replace(/ /g, '');
                    const ruleData = fs.readFileSync(cab + "/rules/" + each + ".zt", "utf-8");
                    const ruleItem = JSON.parse(ruleData.replace(/#NAME#/g, field.display));
                    rulesCfg.push(ruleItem);
                });
                fieldObj['optionConfig'].rules = rulesCfg;
            }
            content.push(fieldObj);
        }
    });

    let gridCol = "1";
    if (module.form && module.form.column) {
        gridCol = module.form.column + "";
    }
    const grid = new Grid(Number(gridCol), content);
    grid.appendLine({
        "field": "$button",
        "hidden": true
    });
    return moduleTpl
        .replace(/#MODULE#/g, module.name)
        .replace(/#FIELDS#/g, JSON.stringify(grid.matrix))
};
const getMockJson = (module, multi = false) => {
    const mock = {};
    mock.mock = true;
    if (multi) {
        const dataRecord = [];
        for (let idx = 0; idx < multi; idx++) {
            dataRecord.push(config.execData(module));
        }
        mock.data = {
            count: dataRecord.length,
            list: dataRecord
        };
    } else {
        mock.data = config.execData(module);
    }
    return JSON.stringify(mock, null, 2);
};
const getMockEntry = (folder) => fs.readFileSync(folder + "/mock/index.zt", "utf-8");
const createFile = (targetFile, fnContent, prefix, json = true) => {
    const content = fnContent();
    if (content) {
        fs.writeFileSync(targetFile, content);
        if (json) {
            const json = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
            fs.writeFileSync(targetFile, JSON.stringify(json, null, 4));
        }
        log.info(`${prefix}：${targetFile}`);
    }
};
// UI.json
const createUIJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + "/UI.json", () => {
        const index = fs.readFileSync(tplFolder + 'UI.zt', 'utf-8');
        const title = module.title ? module.title : `${module.name}管理`;
        return index.replace(/#MODULE#/g, title);
    }, "资源文件");
};
// UI.List.json
const createUIListJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + '/UI.List.json', () => getListJson(module, tplFolder), "资源文件");
};
// UI.Form.json
const createUIFormJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + '/UI.Form.json', () => getFormJson(module, tplFolder), "资源文件");
};
// 资源文件
const createConfigJson = (folder, cabPath, module) => {
    // 构造UI.json
    createUIJson(folder, cabPath, module);
    // 构造UI.List.json
    createUIListJson(folder, cabPath, module);
    // 构造UI.Form.json
    createUIFormJson(folder, cabPath, module);
};
// Cab.json/Cab.less
const createCabData = (codePath, comPath) => {
    createFile(comPath + "/Cab.less", () => fs.readFileSync(codePath + "/Cab.less.zt", "utf-8"), "风格文件", false);
    createFile(comPath + "/Cab.json", () => {
        const ns = {};
        ns.ns = comPath.replace(/src\//g, '');
        return JSON.stringify(ns);
    }, "名空间文件")
};
// Act.Types.js/Act.Epic.js
const createReduxFiles = (codePath, comPath, module) => {
    createFile(comPath + "/Act.Types.js", () => {
        let content = fs.readFileSync(codePath + "/Act.Types.zt", "utf-8");
        content = content.replace(/#CODE#/g, module.code);
        content = content.replace(/#UPCODE#/g, module.code.toLocaleUpperCase());
        return content;
    }, "Redux类型文件", false);
    createFile(comPath + "/Act.Epic.js", () => {
        let content = fs.readFileSync(codePath + "/Act.Epic.zt", "utf-8");
        content = content.replace(/#CODE#/g, module.code);
        content = content.replace(/#DWCODE#/g, module.code.toLocaleLowerCase());
        return content;
    }, "Epic文件", false)
};
// Op.ts/Op.Form.ts
const createOpFiles = (codePath, comPath, module) => {
    createFile(comPath + "/Op.ts", () => fs.readFileSync(codePath + "/Op.zt", "utf-8"), "Ts Op入口文件", false);
    createFile(comPath + "/Op.Bar.ts", () => fs.readFileSync(codePath + "/Op.Bar.zt", "utf-8"), "Ts Op工具栏专用文件", false);
    createFile(comPath + "/Op.Form.ts", () => {
        let content = fs.readFileSync(codePath + "/Op.Form.zt", "utf-8");
        content = content.replace(/#DWCODE#/g, module.code.toLocaleLowerCase());
        return content;
    }, "Ts按钮事件文件", false)
};
// UI.js/UI.List.js/UI.Form.js
const createPageFiles = (codePath, comPath, module) => {
    // UI.js
    createFile(comPath + "/UI.js", () => fs.readFileSync(codePath + "/UI.zt", "utf-8"), "UI入口文件", false);
    // UI.List.js
    createFile(comPath + "/UI.List.js", () => {
        let content = fs.readFileSync(codePath + "/UI.List.zt", "utf-8");
        content = content.replace(/#CODE#/g, module.code);
        return content;
    }, "UI.List文件", false);
    // UI.Form.js
    createFile(comPath + "/UI.Form.js", () => {
        let content = fs.readFileSync(codePath + "/UI.Form.zt", "utf-8");
        let fields = "";
        config.eachField(module, (field) => {
            const ant = field.config['ant'] ? field.config['ant'] : "Input";
            if (field.isField) {
                fields += `\n    ${field.name}:` + "(reference, jsx = {}) => (<" + ant + " {...jsx}/>),";
            }
        });
        let gridCol = "1";
        if (module.form && module.form.column) {
            gridCol = module.form.column + "";
        }
        content = content.replace(/#GRIDCOL#/g, gridCol);
        content = content.replace(/#INPUT#/g, fields);
        content = content.replace(/#CODE#/g, module.code);
        return content;
    }, "UI.Form文件", false);
};
// mock 数据
const createMockData = (tplFolder, codePath, module) => {
    createFile(tplFolder + '/fnAdd.json', () => getMockJson(module), "模拟数据");
    createFile(tplFolder + '/fnRead.json', () => getMockJson(module), "模拟数据");
    createFile(tplFolder + '/fnRemove.json', () => getMockJson(module), "模拟数据");
    createFile(tplFolder + '/fnSave.json', () => getMockJson(module), "模拟数据");
    createFile(tplFolder + '/fnSearch.json', () => getMockJson(module, 6), "模拟数据");
    createFile(tplFolder + '/index.js', () => getMockEntry(codePath), "入口模拟", false);
};
exports.createSlist = function () {
    const argv = args.parseArgs(2);
    const inputFile = argv['-c'] || argv['--config'];
    const inputPath = `./.zero/module/${inputFile}`;
    config.execFileExist(inputPath, (configPath) => {
        const configData = JSON.parse(fs.readFileSync(configPath));
        if (configData) {
            // 读取语言信息
            const language = configData['language'];
            const module = configData['module'];
            const path = configData['path'];
            // 构造语言包
            const cabPath =
                `src/cab/${language}/components${path}`;
            io.dirsMake(cabPath);
            log.info(`资源目录创建成功：${cabPath}`);
            // 构造组件包
            const comPath = `src/components${path}`;
            io.dirsMake(comPath);
            log.info(`组件目录创建成功：${comPath}`);
            // 构造Mock文件夹
            const mockPath = `src/components${path}/mock`;
            io.dirsMake(mockPath);
            log.info(`Mock数据文件目录创建橙色：${mockPath}`);
            const folder = __dirname + `/tpl/search-list/cab/${language}/`;
            const codePath = __dirname + `/tpl/search-list/components/`;
            // --------------  生成配置文件
            createConfigJson(folder, cabPath, module);
            // --------------  生成mock数据文件
            createMockData(mockPath, codePath, module);
            // --------------  名空间Cab系列
            createCabData(codePath, comPath);
            // --------------  Act行为事件系列
            createReduxFiles(codePath, comPath, module);
            // --------------  Op事件文件
            createOpFiles(codePath, comPath, module);
            // --------------  UI界面文件
            createPageFiles(codePath, comPath, module);
            log.info("Successfully!" + module.name + "(code =" + module.code + ")模块生成完成！")
        } else {
            log.error(`数据格式不合法，请检查配置文件${configPath}`);
            process.exit();
        }
    })
}