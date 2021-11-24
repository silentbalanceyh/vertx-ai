const Log = require('./ai.export.log');
const Io = require('./ai.export.io');
const Excel = require('exceljs');
// ==========================================================
// Excel
// ==========================================================

const excelLog = (index, message) => Log.info(`Zero AI `.cyan + `「${index}」`.red + message)
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
            const segment = file.split('/');
            const filename = segment[segment.length - 1];
            const target = prefix ? `${out}/${prefix}.${filename}` : `${out}/${filename}`;
            excelLog(index, `创建新数据文件 ${target}`);
            await workbook.xlsx.writeFile(target);
        } else {
            excelLog(index, `文件读取有问题：${file}`.red);
        }
    }
}
const excelRun = (config = {}) => {
    Log.info(`Zero AI `.cyan + ` 1. 准备生成角色对应权限：ID = "${config.role.green}" ...`);
    Io.dirCreate(`${process.cwd()}/${config.out}`);
    // 1. 执行替换
    const {files = [], filesInput = []} = config;
    Log.info(`Zero AI `.cyan + ` 2. 生成 Zero Extension 权限...`.yellow);
    files.forEach((file, index) => excelGenerate(config, file, index))
    Log.info(`Zero AI `.cyan + ` 3. 生成 输入文件 权限...`.yellow);
    filesInput.forEach((file, index) => excelGenerate(config, file, index, "input"))
}
module.exports = {
    excelRun,
};