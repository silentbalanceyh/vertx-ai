const Log = require('./ai.export.log');
const Word = require('./ai.export.word');

const Excel = require('exceljs');
const path = require('path');
// ==========================================================
// Excel
// ==========================================================

const excelTpl = async (config = {}) => {
    const {tpl = {}, input = {}} = config;
    const sourceFile = path.join(__dirname, `../cab/${tpl.type}/${tpl.source}`);
    // 读取Excel
    Log.info(`Zero AI `.cyan + ` 1.1. 加载数据中......`.rainbow);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(sourceFile);
    Log.info(`Zero AI `.cyan + ` 读取原始文件：${sourceFile.blue}`);

    if (workbook) {
        const replaced = input.params;
        const sheetName = replaced['SHEET'];
        Log.info(`Zero AI `.cyan + ` 执行Worksheet：${sheetName.blue}。`);
        const worksheetRef = workbook.getWorksheet(sheetName);
        // 读取表格区域
        const maxRow = worksheetRef['_rows'].length;
        const maxColumn = worksheetRef['_columns'].length;

        Log.info(`Zero AI `.cyan + ` 分析结果：最大行 - ${maxRow.toString().blue}，最大列 - ${maxColumn.toString().blue}。`);
        Log.info(`Zero AI `.cyan + ` 参数表：`);
        Object.keys(replaced).forEach(field => {
            Log.info(`Zero AI `.cyan + ` \t${field.green} = ${replaced[field].yellow}`);
        })

        Log.info(`Zero AI `.cyan + ` 1.2. 更新数据......`.rainbow);
        const report = {
            guid: 0,
            expression: 0,
            invalid: 0,
            skip: 0,
        };
        worksheetRef.eachRow((rowRef, rowNumber) => {
            rowRef.eachCell((cellRef, cellNumber) => {
                const original = cellRef.value;
                if (original && "string" === typeof original) {
                    const counter = Word.strShapeCount(original);
                    if (2 <= counter) {
                        if ("#GUID#" === original) {
                            report.guid++;
                            cellRef.value = Word.strUuid();
                        } else {
                            report.expression++;
                            cellRef.value = Word.strExpr(original, replaced);
                        }
                    } else {
                        if (1 === counter) {
                            // 小于2
                            report.invalid++;
                        } else {
                            report.skip++;
                        }
                    }
                } else {
                    report.skip++;
                }
            })
        })
        Log.info(`Zero AI `.cyan + ` GUID单元格 - \t${report.guid.toString().green}`);
        Log.info(`Zero AI `.cyan + ` 数据单元格 - \t${report.expression.toString().green}`)
        Log.info(`Zero AI `.cyan + ` 待检查单元格 - \t${report.invalid.toString().red}，（ERROR）`);
        Log.info(`Zero AI `.cyan + ` 跳过单元格 - \t${report.expression.toString().yellow}`)
        // 写入目标文件
        Log.info(`Zero AI `.cyan + ` 1.3. 创建新数据文件......`.rainbow);
        const targetFile = `${config.pathOxOOB}/${replaced['PREFIX']}.${replaced['IDENTIFIER']}.xlsx`;
        Log.info(`Zero AI `.cyan + ` 执行Worksheet：${targetFile.blue}。`);
        await workbook.xlsx.writeFile(targetFile);
    }
    return workbook;
}
const excelRun = (config = {}) => {
    Log.info(`Zero AI `.cyan + ` 1. 执行Excel命令......`.rainbow);
    // 1. 执行替换
    excelTpl(config).then(() => {
        Log.info(`Zero AI `.cyan + ` 2. 命令执行完成！！！`.rainbow);
    }).catch(error => {
        console.error(error);
    });
}
module.exports = {
    excelRun,
};