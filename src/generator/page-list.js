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

const getFilter = (module = {}, cab = "") => {
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
            // 构造UI.Filter.json
            const filterFolder = __dirname + `/tpl/page-list/cab/${language}/`;
            const filterFile = cabPath + '/UI.Filter.json';
            const filter = getFilter(module, filterFolder);
            fs.writeFileSync(filterFile, filter);
            log.info(`资源文件：${filterFile}`);
        }
        else {
            log.error(`数据格式不合法，请检查配置文件${configPath}`);
            process.exit();
        }
    })
}
;