#!/usr/bin/env node
/**
 * 检查 src/_template/EXCEL/ex-api 下 template-RBAC_ROLE.xlsx 与 template-RBAC_RESOURCE.xlsx 的详细格式。
 * 输出：工作表名、行/列数、前若干行单元格内容，便于按模板格式填充。
 * 运行：node script/inspect-excel-templates.js
 */
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

const cwd = process.cwd();
const templateDir = path.resolve(cwd, "src", "_template", "EXCEL", "ex-api");
const maxRows = 15;
const maxCols = 20;

async function inspectFile(fileName) {
    const filePath = path.join(templateDir, fileName);
    if (!fs.existsSync(filePath)) {
        console.log("\n文件不存在: " + filePath);
        return null;
    }
    const wb = await new ExcelJS.Workbook().xlsx.readFile(filePath);
    const result = { file: fileName, sheetCount: wb.worksheets.length, sheets: [] };
    for (let i = 0; i < wb.worksheets.length; i++) {
        const ws = wb.worksheets[i];
        const sheetInfo = {
            name: ws.name,
            id: ws.id,
            rowCount: ws.rowCount,
            columnCount: ws.columnCount,
            rows: []
        };
        const rowCount = Math.min(ws.rowCount || 0, maxRows);
        const colCount = Math.min((ws.columnCount || 0) + 5, maxCols);
        for (let r = 1; r <= rowCount; r++) {
            const row = ws.getRow(r);
            const cells = [];
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber <= colCount) {
                    let v = cell && cell.value != null ? cell.value : "";
                    if (v && typeof v === "object" && v.text !== undefined) v = v.text;
                    if (v && typeof v === "object" && v.result !== undefined) v = v.result;
                    cells.push(v);
                }
            });
            for (let c = cells.length; c < colCount; c++) cells.push("");
            sheetInfo.rows.push(cells);
        }
        if (sheetInfo.rows.length === 0 && (ws.columnCount || ws.rowCount)) {
            for (let r = 1; r <= Math.min(5, ws.rowCount || 5); r++) {
                const row = ws.getRow(r);
                const cells = [];
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (colNumber <= maxCols) cells.push(cell && cell.value != null ? cell.value : "");
                });
                sheetInfo.rows.push(cells);
            }
        }
        result.sheets.push(sheetInfo);
    }
    return result;
}

function printResult(obj) {
    if (!obj) return;
    console.log("\n========== " + obj.file + " ==========");
    console.log("工作表数量:", obj.sheetCount);
    obj.sheets.forEach((sh, idx) => {
        console.log("\n--- Sheet[" + idx + "] 名称: " + sh.name + " ---");
        console.log("  行数(约):", sh.rowCount, " 列数(约):", sh.columnCount);
        sh.rows.forEach((row, rIdx) => {
            const line = row.map((c) => (c == null ? "" : String(c).slice(0, 30)));
            console.log("  行" + (rIdx + 1) + ":", JSON.stringify(line));
        });
    });
}

async function main() {
    console.log("模板目录:", templateDir);
    const a = await inspectFile("template-RBAC_RESOURCE.xlsx");
    const b = await inspectFile("template-RBAC_ROLE.xlsx");
    printResult(a);
    printResult(b);
    if (a) {
        const defPath = path.join(templateDir, "template-def.json");
        const def = {
            RBAC_RESOURCE: a.sheets[0] ? { sheetName: a.sheets[0].name, columns: (a.sheets[0].rows[0] || []).map((c) => String(c || "").trim() || null).filter(Boolean) } : null,
            RBAC_ROLE: b && b.sheets[0] ? { sheetName: b.sheets[0].name, columns: (b.sheets[0].rows[0] || []).map((c) => String(c || "").trim() || null).filter(Boolean) } : null
        };
        if (def.RBAC_RESOURCE && def.RBAC_RESOURCE.columns.length) def.RBAC_RESOURCE.columns = def.RBAC_RESOURCE.columns.filter((c) => c);
        if (def.RBAC_ROLE && def.RBAC_ROLE.columns.length) def.RBAC_ROLE.columns = def.RBAC_ROLE.columns.filter((c) => c);
        if (!def.RBAC_RESOURCE || !def.RBAC_RESOURCE.columns.length) def.RBAC_RESOURCE = { sheetName: "DATA-RES", columns: ["ID", "CODE", "NAME", "IDENTIFIER", "TYPE", "LEVEL", "MODE_ROLE"] };
        if (!def.RBAC_ROLE || !def.RBAC_ROLE.columns.length) def.RBAC_ROLE = { sheetName: "DATA-PERM", columns: ["ROLE_ID", "PERM_ID"] };
        fs.writeFileSync(defPath, JSON.stringify(def, null, 2), "utf-8");
        console.log("\n已写入 template-def.json（表头从首行解析）");
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
