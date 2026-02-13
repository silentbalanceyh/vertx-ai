#!/usr/bin/env node
/**
 * 清空 src/_template/EXCEL/ex-api 下两个模板 xlsx 中所有 {TABLE} 区域的数据行，只保留表头。
 * 执行一次后，ai ex-api 只需直接填充数据，无需运行时清除。
 * 运行：node script/clear-excel-template-data.js
 */
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");

const cwd = process.cwd();
const templateDir = path.resolve(cwd, "src", "_template", "EXCEL", "ex-api");
const maxCols = 50;
const limit = 5000;

function scanTableRegions(ws) {
    if (!ws) return [];
    const regions = [];
    let i = 1;
    while (i <= limit) {
        const row = ws.getRow(i);
        const first = row.getCell(1).value;
        const v = first != null ? String(first).trim() : "";
        if (v === "{TABLE}") {
            const tableNameCell = row.getCell(2).value;
            const tableName = tableNameCell != null ? String(tableNameCell).trim() : "";
            const headerRowCount = 2;
            const dataStartRow = i + 1 + headerRowCount;
            let dataEndRow = dataStartRow - 1;
            let j = i + 1;
            while (j <= limit) {
                const nextRow = ws.getRow(j);
                const nextFirst = nextRow.getCell(1).value;
                const nv = nextFirst != null ? String(nextFirst).trim() : "";
                if (nv === "{TABLE}") {
                    dataEndRow = j - 1;
                    break;
                }
                dataEndRow = j;
                j++;
            }
            regions.push({ tableName, tableStartRow: i, dataStartRow, dataEndRow });
            i = dataEndRow + 1;
            continue;
        }
        i++;
    }
    return regions;
}

function clearRegion(ws, dataStartRow, dataEndRow) {
    for (let r = dataStartRow; r <= dataEndRow; r++) {
        const row = ws.getRow(r);
        for (let c = 1; c <= maxCols; c++) row.getCell(c).value = null;
    }
}

/** 清除指定行的背景与边框（表间两行空白用） */
function clearBlankRowFormat(ws, startRow, endRow, maxCols) {
    if (!ws || endRow < startRow) return;
    const cols = maxCols || 20;
    const noFill = { type: "pattern", pattern: "none" };
    const noBorder = { top: { style: "none" }, left: { style: "none" }, bottom: { style: "none" }, right: { style: "none" } };
    for (let r = startRow; r <= endRow; r++) {
        const row = ws.getRow(r);
        for (let c = 1; c <= cols; c++) {
            const cell = row.getCell(c);
            if (cell.fill) cell.fill = noFill;
            if (cell.border) cell.border = noBorder;
        }
    }
}

/** 表间只保留 2 行空白：删除 (dataStartRow+3) 到 (下一表 tableStartRow-1) 的多余行，从后往前删避免行号变化 */
function compressTableGaps(ws, regions) {
    if (!regions || regions.length < 2) return;
    const BLANK_ROWS = 2;
    const deletions = [];
    for (let i = 0; i < regions.length - 1; i++) {
        const start = regions[i].dataStartRow + 1 + BLANK_ROWS; // 保留 1 行数据位 + 2 空行
        const end = regions[i + 1].tableStartRow - 1;
        if (end >= start) {
            const count = end - start + 1;
            deletions.push({ start, count });
        }
    }
    deletions.sort((a, b) => b.start - a.start);
    deletions.forEach(({ start, count }) => {
        try {
            ws.spliceRows(start, count);
        } catch (e) {
            console.warn("spliceRows(" + start + "," + count + ") 跳过: " + e.message);
        }
    });
}

async function processFile(fileName) {
    const filePath = path.join(templateDir, fileName);
    if (!fs.existsSync(filePath)) {
        console.log("跳过（不存在）: " + filePath);
        return;
    }
    const wb = await new ExcelJS.Workbook().xlsx.readFile(filePath);
    let cleared = 0;
    wb.worksheets.forEach((ws) => {
        const regions = scanTableRegions(ws);
        regions.forEach((reg) => {
            clearRegion(ws, reg.dataStartRow, reg.dataEndRow);
            cleared += Math.max(0, reg.dataEndRow - reg.dataStartRow + 1);
            clearBlankRowFormat(ws, reg.dataStartRow + 1, reg.dataStartRow + 2, maxCols);
        });
        compressTableGaps(ws, regions);
    });
    await wb.xlsx.writeFile(filePath);
    console.log("已清空、压缩并写回: " + fileName + "（清除 " + cleared + " 行，表间仅留 2 行空行）");
}

async function main() {
    console.log("模板目录: " + templateDir);
    await processFile("template-RBAC_RESOURCE.xlsx");
    await processFile("template-RBAC_ROLE.xlsx");
    console.log("完成。模板仅保留表头，ai ex-api 将直接填充数据。");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
