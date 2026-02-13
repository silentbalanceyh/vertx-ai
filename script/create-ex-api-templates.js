#!/usr/bin/env node
/**
 * 生成 ai ex-api 使用的 Excel 模板，写入 src/_template/ex-api/
 * 可与 ZERO_MODULE 下已有 RBAC Excel 格式对齐后，将彼处文件复制到 src/_template/ex-api/ 覆盖本脚本生成的标准模板。
 * 运行：node script/create-ex-api-templates.js
 */
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

const cwd = process.cwd();
const templateDir = path.resolve(cwd, "src", "_template", "ex-api");

if (!fs.existsSync(templateDir)) fs.mkdirSync(templateDir, { recursive: true });

async function main() {
    const wbRes = new ExcelJS.Workbook();
    wbRes.creator = "ai ex-api template";
    const wsRes = wbRes.addWorksheet("DATA-RES", { views: [{ state: "frozen", ySplit: 1 }] });
    wsRes.addRow(["ID", "CODE", "NAME", "IDENTIFIER", "TYPE", "LEVEL", "MODE_ROLE"]);

    const wbRole = new ExcelJS.Workbook();
    wbRole.creator = "ai ex-api template";
    const wsRole = wbRole.addWorksheet("DATA-PERM", { views: [{ state: "frozen", ySplit: 1 }] });
    wsRole.addRow(["ROLE_ID", "PERM_ID"]);

    const outRes = path.join(templateDir, "template-RBAC_RESOURCE.xlsx");
    const outRole = path.join(templateDir, "template-RBAC_ROLE.xlsx");
    await wbRes.xlsx.writeFile(outRes);
    await wbRole.xlsx.writeFile(outRole);
    console.log("已生成模板：");
    console.log("  " + outRes);
    console.log("  " + outRole);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
