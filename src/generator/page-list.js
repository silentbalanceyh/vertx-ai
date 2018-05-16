const ai = require('../zero/zero');
const {args, log, io, config} = ai;
const fs = require("fs");
const Field = require('./model/field');
const Grid = require('./model/grid');

const eachField = (module = {}, callback) => {
    if (module['fields']) {
        module['fields'].forEach((field, index) => {
            try {
                const obj = new Field(field);
                if (callback) callback(obj, index === module['fields'].length - 1);
            } catch (error) {
                log.error(`${module.code} -> 字段表达式无法解析！`);
                console.error(error);
                process.exit();
            }
        });
    } else {
        log.error(`${module.code} -> 配置数据有问题，没有\`fields\`节点！`);
        process.exit();
    }

};

const getFilterJson = (module = {}, cab = "") => {
    const moduleTpl = fs.readFileSync(cab + '/UI.Filter.zt', 'utf-8');
    const fieldTpl = cab + '/UI.Filter.Field.zt';
    // 遍历字段
    const content = [];
    eachField(module, (field) => {
        if (field.isFilter) {
            const lineTpl = fs.readFileSync(fieldTpl, "utf-8");
            const lineCtx = lineTpl.replace(/#NAME#/g, field.name).replace(/#DISPLAY#/g, field.display);
            content.push(lineCtx);
        }
    });
    content.push(`{\n\t"field":"$button"\n}`);
    const grid = new Grid(3, content);
    return moduleTpl.replace(/#ROW#/g, grid.matrix);
};

const getListJson = (module = {}, cab = "") => {
    const moduleTpl = fs.readFileSync(cab + "/UI.List.zt", "utf-8");
    const columnTpl = cab + '/UI.List.Column.zt';
    // 遍历字段
    const content = [];
    const condition = {};
    eachField(module, (field) => {
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
    eachField(module, (field) => {
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
    return moduleTpl
        .replace(/#MODULE#/g, module.name)
        .replace(/#FIELDS#/g, JSON.stringify(content))
};
const createFile = (targetFile, fnContent, prefix) => {
    const content = fnContent();
    if (content) {
        fs.writeFileSync(targetFile, content);
        const json = JSON.parse(fs.readFileSync(targetFile, "utf-8"));
        fs.writeFileSync(targetFile, JSON.stringify(json, null, 4));
        log.info(`${prefix}：${targetFile}`);
    }
};
// UI.json
const createUIJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + "/UI.json", () => {
        const index = fs.readFileSync(tplFolder + 'UI.zt', 'utf-8');
        return index.replace(/#MODULE#/g, `${module.name}管理`);
    }, "资源文件");
};
// UI.Filter.json
const createUIFilterJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + '/UI.Filter.json', () => getFilterJson(module, tplFolder), "资源文件");
};
// UI.List.json
const createUIListJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + '/UI.List.json', () => getListJson(module, tplFolder), "资源文件");
};
// UI.Form.json
const createUIFormJson = (tplFolder, cabPath, module = {}) => {
    createFile(cabPath + '/UI.Form.json', () => getFormJson(module, tplFolder), "资源文件");
};
exports.createPlist = function () {
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
            const folder = __dirname + `/tpl/page-list/cab/${language}/`;
            // 构造UI.json
            createUIJson(folder, cabPath, module);
            // 构造UI.Filter.json
            createUIFilterJson(folder, cabPath, module);
            // 构造UI.List.json
            createUIListJson(folder, cabPath, module);
            // 构造UI.Form.json
            createUIFormJson(folder, cabPath, module);
        }
        else {
            log.error(`数据格式不合法，请检查配置文件${configPath}`);
            process.exit();
        }
    })
}
;