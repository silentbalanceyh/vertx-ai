const __LOG = require('./ai.unified.fn._.logging');
const __STR = require('./ai.export.interface.fn.string');
const __IO = require('./ai.export.interface.io');
const Excel = require('exceljs');
const path = require("path");
// ==========================================================
// Excel
// ==========================================================

const excelLog = (index, message) => __LOG.info(`Zero AI `.cyan + `「${index}」`.red + message)
const excelGenerate = async (config = {}, file, index, prefix) => {
    const {role, out} = config;
    excelLog(index, ` -> 加载数据中`);
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(file);
    excelLog(index, ` 读取原始文件：${file.blue}`)
    if (workbook) {
        const worksheetRef = workbook.getWorksheet("DATA-PERM");
        if (worksheetRef) {
            const maxRow = worksheetRef['_rows'].length;
            const maxColumn = worksheetRef['_columns'].length;
            excelLog(index, ` 分析结果：最大行 - ${maxRow.toString().blue}，最大列 - ${maxColumn.toString().blue}。`);
            worksheetRef.eachRow((rowRef, rowNumber) => {
                rowRef.eachCell((cellRef, cellNumber) => {
                    const original = cellRef.value;
                    if ("#ROLE_ID#" === original) {
                        cellRef.value = role;
                    } else if ("e501b47a-c08b-4c83-b12b-95ad82873e96" === original) {
                        cellRef.value = role;
                    }
                })
            })
            const segment = file.split(path.sep);
            const filename = segment[segment.length - 1];
            const target = prefix ? `${out}${path.sep}${prefix}.${filename}` : `${out}${path.sep}${filename}`;
            excelLog(index, `创建新数据文件 ${target}`);
            await workbook.xlsx.writeFile(target);
        } else {
            excelLog(index, `文件读取有问题：${file}`.red);
        }
    }
}
const excelRun = (config = {}) => {
    __LOG.info(`Zero AI `.cyan + ` 1. 准备生成角色对应权限：ID = "${config.role.green}" ...`);
    __IO.dirCreate(`${process.cwd()}${path.sep}${config.out}`);
    // 1. 执行替换
    const {files = [], filesInput = []} = config;
    __LOG.info(`Zero AI `.cyan + ` 2. 生成 Zero Extension 权限...`.yellow);
    files.forEach((file, index) => excelGenerate(config, file, index))
    __LOG.info(`Zero AI `.cyan + ` 3. 生成 输入文件 权限...`.yellow);
    filesInput.forEach((file, index) => excelGenerate(config, file, index, "input"))
}
const excelResource = async (config = {}, parameters = {}, pid = [], sheetName = "DATA-RES") => {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(config.resource);
    __LOG.info(`Zero AI `.cyan + ` 2.1. 数据加载中，替换原始文件……`);
    if (workbook) {
        const worksheetRef = workbook.getWorksheet(sheetName);
        if (worksheetRef) {
            const maxRow = worksheetRef['_rows'].length;
            const maxColumn = worksheetRef['_columns'].length;
            __LOG.info(`Zero AI `.cyan + ` 2.2. 分析结果：最大行 - ${maxRow.toString().blue}，最大列 - ${maxColumn.toString().blue}。`);
            const pidSet = new Set();
            const generate = 0 === pid.length
            worksheetRef.eachRow((rowRef, rowNumber) => {
                rowRef.eachCell((cellRef, cellNumber) => {
                    const original = cellRef.value;
                    if ("string" === typeof original) {
                        if ("#GUID#" === original) {
                            cellRef.value = __STR.strUuid();
                        } else if ("#PID#" === original) {
                            if (generate) {
                                const permId = __STR.strUuid();
                                cellRef.value = permId;
                                pid.push(permId)
                            } else {
                                let found;
                                for (let idx = 0; idx < pid.length; idx++) {
                                    if (!pidSet.has(pid[idx])) {
                                        pidSet.add(pid[idx]);
                                        found = pid[idx];
                                        break;
                                    }
                                }
                                cellRef.value = found;
                            }
                        } else {
                            cellRef.value = __STR.strExpr(original, parameters)
                        }
                    }
                })
            });
            __LOG.info(`Zero AI `.cyan + ` 1.3. 创建新数据文件......`.rainbow);
            const targetFile = `./${config.identifier}.xlsx`;
            __LOG.info(`Zero AI `.cyan + ` 执行Worksheet：${targetFile.blue}。`);
            await workbook.xlsx.writeFile(targetFile);
        } else {
            __LOG.info(`Zero AI `.cyan + ` ERROR，文件读取有错！！`.red);
        }
    }
}
const excelRes = (file = {}, parameters = {}) => {
    __LOG.info(`Zero AI `.cyan + ` 1. 准备生成资源信息..., ${JSON.stringify(parameters)}`);
    __LOG.info(`Zero AI `.cyan + ` 2. 生成 Zero Extension 资源文件...`.yellow);
    const pid = []
    excelResource(file, parameters, pid).then(result => {
        __LOG.info(`Zero AI `.cyan + ` 3. 资源生成完成...`.green);
        return Promise.resolve(result)
    }).then(nil => {
        __LOG.info(`Zero AI `.cyan + ` 4. 准备生成权限信息..., ${JSON.stringify(parameters)}`);
        const res = {};
        res.resource = file.auth;
        res.identifier = "falcon." + file.identifier;
        return excelResource(res, parameters, pid, "DATA-PERM");
    }).then(nil => {
        __LOG.info(`Zero AI `.cyan + ` 5. 权限文件生成完成...`.green);
        const viewJson = __IO.ioJObject(file.json);
        viewJson.data.identifier = file.identifier;
        const targetFile = `./${file.identifier}.json`;
        __IO.outJson(targetFile, viewJson);
        __LOG.info(`Zero AI `.cyan + ` 执行完成...`.green);

    });
}
module.exports = {
    excelRun,
    excelRes
};