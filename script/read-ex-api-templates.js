#!/usr/bin/env node
/**
 * 解读 src/_template/ex-api 下两个 xlsx，提取工作表名与首行表头，生成 template-def.json 供 ai ex-api 按模版生成。
 * 运行：node script/read-ex-api-templates.js
 */
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

const cwd = process.cwd();
const templateDir = path.resolve(cwd, "src", "_template", "ex-api");
const resPath = path.join(templateDir, "template-RBAC_RESOURCE.xlsx");
const rolePath = path.join(templateDir, "template-RBAC_ROLE.xlsx");

async function readSheetDef(filePath, key) {
    if (!fs.existsSync(filePath)) {
        console.warn("文件不存在，跳过: " + filePath);
        return null;
    }
    const wb = await new ExcelJS.Workbook().xlsx.readFile(filePath);
    const ws = wb.worksheets[0];
    if (!ws) return null;
    const sheetName = ws.name;
    const firstRow = ws.getRow(1);
    const columns = [];
    firstRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const v = cell && cell.value != null ? String(cell.value).trim() : "";
        columns.push(v || "Column" + colNumber);
    });
    return { sheetName, columns };
}

async function main() {
    const RBAC_RESOURCE = await readSheetDef(resPath, "RBAC_RESOURCE");
    const RBAC_ROLE = await readSheetDef(rolePath, "RBAC_ROLE");

    const def = {
        RBAC_RESOURCE: RBAC_RESOURCE || { sheetName: "DATA-RES", columns: ["ID", "CODE", "NAME", "IDENTIFIER", "TYPE", "LEVEL", "MODE_ROLE"] },
        RBAC_ROLE: RBAC_ROLE || { sheetName: "DATA-PERM", columns: ["ROLE_ID", "PERM_ID"] }
    };

    const outPath = path.join(templateDir, "template-def.json");
    fs.writeFileSync(outPath, JSON.stringify(def, null, 2), "utf-8");
    console.log("已解读 xlsx 并写入模版定义：" + outPath);
    console.log(JSON.stringify(def, null, 2));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
